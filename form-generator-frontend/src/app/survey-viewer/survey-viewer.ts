import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, Renderer2 } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Model } from 'survey-core';
import { ActivatedRoute } from '@angular/router';
import 'survey-angular/defaultV2.css';
import { SurveyModule } from 'survey-angular-ui';
import { SurveyResult } from '../services/survey-result';

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
  
  private customStyleElement: HTMLStyleElement | null = null;

  ngOnInit() {
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

  loadSurvey(slug: string) {
    this.http.get<any>(`/api/surveys/slug/${slug}`).subscribe({
      next: (surveyData) => {
        if (!surveyData || !surveyData.jsonData || typeof surveyData.jsonData !== 'object') {
          console.error('Invalid or empty jsonData received:', surveyData.jsonData);
          this.errorLoading = true;
          this.isLoading = false;
          return;
        }

        // Store the survey ID for saving results
        this.currentSurveyId = surveyData.id;

        const survey = new Model(surveyData.jsonData);

        // Save results on survey completion
        survey.onComplete.add((sender) => {
          console.log('Survey completed with results:', sender.data);
          this.saveSurveyResults(sender.data);
        });

        // Save partial results on each page change
        survey.onCurrentPageChanged.add((sender, options) => {
          if (sender.currentPageNo > 0 || Object.keys(sender.data).length > 0) {
            console.log('Survey page changed, saving partial results:', sender.data);
            this.saveSurveyResults(sender.data);
          }
        });

        this.surveyModel = survey;
        this.isLoading = false;

        // Apply custom CSS if it exists
        if (surveyData.customCss) {
          this.applyCustomStyles(surveyData.customCss);
        }
      },
      error: (err) => {
        console.error('Failed to load survey', err);
        this.isLoading = false;
        this.errorLoading = true;
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

  saveSurveyResults(results: any) {
    if (this.currentSurveyId === null) {
      console.error('Cannot save survey results: Survey ID is not set.');
      return;
    }

    const resultData = {
      surveyId: this.currentSurveyId,
      results: results
    };

    if (this.currentSurveyResultId === null) {
      // First time saving results for this session (POST)
      this.surveyResultService.saveSurveyResult(resultData).subscribe({
        next: (response) => {
          console.log('Survey results saved successfully:', response);
          this.currentSurveyResultId = response.id;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving survey results:', error);
          // Don't show alert to user in viewer, just log the error
        }
      });
    } else {
      // Update existing results (PATCH)
      this.surveyResultService.updateSurveyResult(this.currentSurveyResultId, results).subscribe({
        next: (response) => {
          console.log('Survey results updated successfully:', response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating survey results:', error);
          // Don't show alert to user in viewer, just log the error
        }
      });
    }
  }
}