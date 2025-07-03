import { Component } from '@angular/core';
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
export class SurveyRenderer {
  jsonInput: string = '';
  surveyTitle: string = '';
  slug: string = '';

  currentSurveyId: number | null = null;
  currentSurveyResultId: number | null = null;
  surveyModel: Model = new Model({});
  isLoading = true;
  errorLoading = false;

  constructor(
    private surveyService: SurveyService,
    private surveyResultService: SurveyResult
  ) {}

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
    } catch (err) {
      alert('Invalid JSON');
    }
  }

  saveSurveyResults(results: any) {
    if (this.currentSurveyId === null) {
      alert('Cannot save survey results: Survey ID is not set. Please load or save a survey first.');
      return;
    }

    const resultData = {
      surveyId: this.currentSurveyId, // Use the ID of the currently active survey
      results: results // The data collected from the completed survey
    };

    if (this.currentSurveyResultId === null) {
      // First time saving results for this session (POST)
      this.surveyResultService.saveSurveyResult(resultData).subscribe({
        next: (response) => {
          console.log('Initial survey results saved successfully:', response);
          this.currentSurveyResultId = response.id; // Store the ID of the new survey_results record
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
      // Update existing results (PATCH)
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
      // Attempt to parse JSON to ensure it's valid before sending
      const parsedJson = JSON.parse(this.jsonInput);

      // Create the survey data object to send via the service
      const surveyData = {
        name: this.surveyTitle,
        slug: this.slug,
        jsonData: parsedJson
      };

      // Call the saveSurvey method from the SurveyService
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
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving survey:', error);
          let errorMessage = 'Failed to save survey. Please try again.';
          // Check for specific error messages from the backend if available
          if (error.status === 409) { // Conflict status, likely due to unique constraint
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
}
