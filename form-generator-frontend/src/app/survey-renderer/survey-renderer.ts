import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Survey from 'survey-angular';
import { HttpErrorResponse } from '@angular/common/http';
import 'survey-angular/defaultV2.css';
import { SurveyService } from '../services/survey';

@Component({
  selector: 'app-survey-renderer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './survey-renderer.html',
  styleUrl: './survey-renderer.css'
})
export class SurveyRenderer {
  jsonInput: string = '';
  surveyTitle: string = '';
  slug: string = '';

  constructor(private surveyService: SurveyService) {}

  renderSurvey() {
    try {
      const surveyJson = JSON.parse(this.jsonInput);
      const survey = new Survey.Model(surveyJson);

      survey.onComplete.add((sender) => {
        console.log('Survey results:', sender.data);
        // TODO: Send to backend
      });

      Survey.SurveyNG.render('surveyContainer', { model: survey });
    } catch (err) {
      alert('Invalid JSON');
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
          this.jsonInput = '';
          this.surveyTitle = '';
          this.slug = '';
          const container = document.getElementById('surveyContainer');
          if (container) {
            container.innerHTML = ''; // Clear rendered survey
          }
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
