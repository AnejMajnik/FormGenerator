import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyRendererSimple } from './survey-renderer-simple/survey-renderer-simple';
import { SurveyViewerSimple } from './survey-viewer-simple/survey-viewer-simple';

@Component({
  selector: 'app-survey-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, SurveyRendererSimple, SurveyViewerSimple],
  templateUrl: './survey-editor.html',
  styleUrl: './survey-editor.css'
})
export class SurveyEditorComponent {
  // Parent component data
  surveyDefinition: string = `{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "checkbox",
          "name": "question1",
          "title": "Which movies have you seen?",
          "choices": [
            {
              "value": "Item 1",
              "text": "Terminator"
            },
            {
              "value": "Item 2",
              "text": "Dune"
            },
            {
              "value": "Item 3",
              "text": "Fast and furious"
            }
          ]
        },
        {
          "type": "boolean",
          "name": "question2",
          "title": "Are you above the age of 18?"
        },
        {
          "type": "dropdown",
          "name": "question3",
          "title": "Choose your country",
          "choices": [
            {
              "value": "Item 1",
              "text": "Slovenia"
            },
            {
              "value": "Item 2",
              "text": "Japan"
            },
            {
              "value": "Item 3",
              "text": "United States"
            }
          ]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "boolean",
          "name": "question4",
          "title": "Do you enjoy video games"
        },
        {
          "type": "text",
          "name": "question5",
          "title": "What is your favorite video game"
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "dropdown",
          "name": "question6",
          "title": "Choose your gender",
          "choices": [
            {
              "value": "Item 1",
              "text": "Male"
            },
            {
              "value": "Item 2",
              "text": "Female"
            },
            {
              "value": "Item 3",
              "text": "Other/Prefer not to say"
            }
          ]
        }
      ]
    }
  ],
  "headerView": "advanced"
}`;

  activeSurveyJson: string = '';
  currentPage: string = 'Not started';
  surveyStatus: string = 'Waiting for form definition';

  // Event handler for when Apply button is clicked
  onApplyClicked(surveyJson: string) {
    this.activeSurveyJson = surveyJson;
    this.surveyStatus = 'Form applied - ready for preview';
    this.currentPage = 'Loading...';
  }

  // Event handler for page changes from child component
  onPageChanged(pageInfo: { currentPage: number; totalPages: number; pageName?: string }) {
    this.currentPage = `Page ${pageInfo.currentPage + 1} of ${pageInfo.totalPages}`;
    if (pageInfo.pageName) {
      this.currentPage += ` (${pageInfo.pageName})`;
    }
  }

  // Event handler for survey completion
  onSurveyCompleted(results: any) {
    this.surveyStatus = 'Survey completed!';
    this.currentPage = 'Completed';
    console.log('Survey completed with results:', results);
  }
}