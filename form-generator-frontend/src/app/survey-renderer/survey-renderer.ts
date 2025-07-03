import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import 'survey-angular/defaultV2.css';
import { SurveyService } from '../services/survey';
import { SurveyResult } from '../services/survey-result';
import { CommonModule } from '@angular/common';
import { SurveyModule } from 'survey-angular-ui';
import { Model } from 'survey-core';

@Component({
  selector: 'app-survey-renderer',
  standalone: true,
  imports: [FormsModule, CommonModule, SurveyModule],
  templateUrl: './survey-renderer.html',
  styleUrl: './survey-renderer.css'
})
export class SurveyRenderer implements OnDestroy {
  jsonInput: string = '';
  surveyTitle: string = '';
  slug: string = '';
  customCss: string = '';
  enableCssPreview: boolean = false;

  currentSurveyId: number | null = null;
  currentSurveyResultId: number | null = null;
  surveyModel: Model = new Model({});
  isLoading = true;
  errorLoading = false;
  surveyContainerClass = '';

  private customStyleElement: HTMLStyleElement | null = null;

  constructor(
    private surveyService: SurveyService,
    private surveyResultService: SurveyResult,
    private renderer: Renderer2
  ) {}

  ngOnDestroy() {
    this.removeCustomStyles();
  }

  renderSurvey() {
    try {
      const surveyJson = JSON.parse(this.jsonInput);
      const survey = new Model(surveyJson);

      // At completion of the survey, save the results
      survey.onComplete.add((sender) => {
        console.log('Survey results:', sender.data);
        this.saveSurveyResults(sender.data);
      });

      survey.onCurrentPageChanged.add((sender, options) => {
        if (sender.currentPageNo > 0 || Object.keys(sender.data).length > 0) {
            console.log('Survey page changed, saving partial results:', sender.data);
            this.saveSurveyResults(sender.data);
        }
      });

      this.surveyModel = survey;
      
      // Apply custom CSS if preview is enabled
      if (this.enableCssPreview && this.customCss.trim()) {
        this.applyCustomStyles();
      } else {
        this.removeCustomStyles();
      }
    } catch (err) {
      alert('Invalid JSON');
    }
  }

  private applyCustomStyles() {
    this.removeCustomStyles();
    
    if (this.customCss.trim()) {
      this.customStyleElement = this.renderer.createElement('style');
      this.renderer.setProperty(this.customStyleElement, 'textContent', this.customCss);
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
      alert('Cannot save survey results: Survey ID is not set. Please load or save a survey first.');
      return;
    }

    const resultData = {
      surveyId: this.currentSurveyId,
      results: results
    };

    if (this.currentSurveyResultId === null) {
      this.surveyResultService.saveSurveyResult(resultData).subscribe({
        next: (response) => {
          console.log('Initial survey results saved successfully:', response);
          this.currentSurveyResultId = response.id;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving initial survey results:', error);
          let errorMessage = 'Failed to save initial survey results. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    } else {
      this.surveyResultService.updateSurveyResult(this.currentSurveyResultId, results).subscribe({
        next: (response) => {
          console.log('Survey results updated successfully:', response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating survey results:', error);
          let errorMessage = 'Failed to update survey results. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }

  saveSurvey() {
    if (!this.surveyTitle.trim()) {
      alert('Survey Title cannot be empty.');
      return;
    }

    if (!this.slug.trim()) {
      alert('Slug cannot be empty.');
      return;
    }

    try {
      const parsedJson = JSON.parse(this.jsonInput);

      const surveyData = {
        name: this.surveyTitle,
        slug: this.slug,
        jsonData: parsedJson,
        customCss: this.customCss.trim() || undefined
      };

      this.surveyService.saveSurvey(surveyData).subscribe({
        next: (response) => {
          console.log('Survey saved successfully!', response);
          alert('Survey saved successfully!');
          if (response && response.id) {
            this.currentSurveyId = response.id;
          }
          this.jsonInput = '';
          this.surveyTitle = '';
          this.slug = '';
          this.customCss = '';
          this.enableCssPreview = false;
          this.removeCustomStyles();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving survey:', error);
          let errorMessage = 'Failed to save survey. Please try again.';
          if (error.status === 409) {
            errorMessage = 'A survey with this title or slug already exists.';
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    } catch (err) {
      console.error('Invalid JSON for saving:', err);
      alert('Invalid JSON format. Cannot save survey.');
    }
  }

  // Toggle CSS preview
  onCssPreviewToggle() {
    if (this.enableCssPreview && this.customCss.trim()) {
      this.applyCustomStyles();
    } else {
      this.removeCustomStyles();
    }
  }
}