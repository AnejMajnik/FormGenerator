import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, Renderer2 } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Model } from 'survey-core';
import { ActivatedRoute } from '@angular/router';
import 'survey-angular/defaultV2.css';
import { SurveyModule } from 'survey-angular-ui';
import { SurveyResult } from '../services/survey-result';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-survey-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, SurveyModule],
  templateUrl: './survey-viewer.html',
  styleUrl: './survey-viewer.css'
})
export class SurveyViewer implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private renderer = inject(Renderer2);
  private surveyResultService = inject(SurveyResult);
  
  surveyModel: Model = new Model({});
  isLoading = true;
  errorLoading = false;
  
  // For result saving
  currentSurveyId: number | null = null;
  currentSurveyResultId: number | null = null;
  sessionId: string = '';
  userId: string | null = null;
  
  private customStyleElement: HTMLStyleElement | null = null;

  ngOnInit() {
    this.sessionId = this.generateSessionId();

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadSurvey(slug);
      } else {
        console.error("Survey slug is missing from route parameters!");
        this.isLoading = false;
        this.errorLoading = true;
      }
    });
  }

  ngOnDestroy() {
    this.removeCustomStyles();
  }

  private generateSessionId(): string {
    // Generate UUID
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback for older browsers
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getOrCreateSessionId(): string {
    if (!this.currentSurveyId) {
      // Fallback if surveyId not available yet
      return this.generateSessionId();
    }
  
    const storageKey = `survey-session-${this.currentSurveyId}`;
    let sessionId = localStorage.getItem(storageKey);
    
    if (!sessionId) {
      // Generate new session ID
      sessionId = this.generateSessionId();
      localStorage.setItem(storageKey, sessionId);
    }
    
    return sessionId;
  }

  loadSurvey(slug: string) {
    this.http.get<any>(`/api/surveys/slug/${slug}`).subscribe({
      next: (surveyData) => {
        if (!surveyData || !surveyData.jsonData || typeof surveyData.jsonData !== 'object') {
          console.error('Invalid or empty jsonData received:', surveyData.jsonData);
          this.errorLoading = true;
          this.isLoading = false;
          return;
        }

        this.currentSurveyId = surveyData.id;
        this.sessionId = this.getOrCreateSessionId();

        const survey = new Model(surveyData.jsonData);

        this.restoreSurveyData(survey).then(() => {
          // Save results on value change
          survey.onValueChanged.add((sender, options) => {
            this.saveSurveyData(sender);
          });

          // Save results on page change
          survey.onCurrentPageChanged.add((sender, options) => {
            this.saveSurveyData(sender);
          });

          // Save results on survey completion
          survey.onComplete.add((sender) => {
            this.completeSurvey(sender);
          });
          
          this.surveyModel = survey;
          this.isLoading = false;

          // Apply custom CSS if it exists
          if (surveyData.customCss) {
            this.applyCustomStyles(surveyData.customCss);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load survey', err);
        this.isLoading = false;
        this.errorLoading = true;
      }
    });
  }

  private async restoreSurveyData(survey: Model): Promise<void> {  
    if (!this.currentSurveyId) return;

    try {
      // Try to get incomplete results for this session/user
      const params = this.userId ? 
        `?userId=${this.userId}` : 
        `?sessionId=${this.sessionId}`;
      
      
      const response = await firstValueFrom(
        this.http.get<any>(`/api/survey-results/incomplete/${this.currentSurveyId}${params}`)
      );

      if (response && response.results) {
        survey.data = response.results;
        
        // Restore the current page
        if (response.currentPageNo !== undefined && response.currentPageNo > 0) {
          survey.currentPageNo = response.currentPageNo;
        }
        
        // Store the existing result ID for future updates
        this.currentSurveyResultId = response.id;  
      } else {
        // No previous data found, reset the result ID
        this.currentSurveyResultId = null;
      }
    } catch (error) {
      // Reset the result ID since no previous data exists
      this.currentSurveyResultId = null;
    }
  }

  private completeSurvey(survey: Model): void {
    if (!this.currentSurveyResultId) {
      console.error('Cannot complete survey: No result ID found.');
      return;
    }

    // Mark survey as completed
    this.http.patch(`/api/survey-results/${this.currentSurveyResultId}/complete`, {
      results: survey.data
    }).subscribe({
      next: (response) => {
        console.log('Survey completed successfully:', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error completing survey:', error);
      }
    });
  }

  private applyCustomStyles(customCss: string) {
    this.removeCustomStyles();
    
    if (customCss.trim()) {
      this.customStyleElement = this.renderer.createElement('style');
      this.renderer.setProperty(this.customStyleElement, 'textContent', customCss);
      this.renderer.setAttribute(this.customStyleElement, 'data-survey-custom-css', 'true');
      this.renderer.appendChild(document.head, this.customStyleElement);
    }
  }

  private removeCustomStyles() {
    if (this.customStyleElement && this.customStyleElement.parentNode) {
      this.renderer.removeChild(document.head, this.customStyleElement);
      this.customStyleElement = null;
    }
  }

  private saveSurveyData(survey: Model): void {
    if (!this.currentSurveyId) {
      return;
    }

    const resultData = {
      surveyId: this.currentSurveyId,
      results: survey.data,
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      currentPageNo: survey.currentPageNo
    };

    if (this.currentSurveyResultId === null || this.currentSurveyResultId === undefined) {
      // First time saving results for this session (POST)
      this.surveyResultService.saveSurveyResult(resultData).subscribe({
        next: (response) => {
          this.currentSurveyResultId = response.id;
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error saving survey data:', error);
        }
      });
    } else {
      // Update existing results (PATCH)
      this.surveyResultService.updateSurveyResult(
        this.currentSurveyResultId, 
        survey.data,
        survey.currentPageNo,
        false  // isCompleted = false for partial saves
      ).subscribe({
        next: (response) => {
          console.log('Survey data updated (existing):', response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating survey data:', error);
          console.error('Will try creating new record instead...');
          
          // Fallback: if update fails, create new record
          this.currentSurveyResultId = null;
          this.saveSurveyData(survey);
        }
      });
    }
  }
}