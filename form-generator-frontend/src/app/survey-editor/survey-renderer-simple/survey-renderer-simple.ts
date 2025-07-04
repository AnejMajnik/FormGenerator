import { Component, Input, Output, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SurveyModule } from 'survey-angular-ui';
import { Model } from 'survey-core';
import 'survey-angular/defaultV2.css';

@Component({
  selector: 'app-survey-renderer-simple',
  standalone: true,
  imports: [FormsModule, CommonModule, SurveyModule],
  templateUrl: './survey-renderer-simple.html',
  styleUrl: './survey-renderer-simple.css'
})
export class SurveyRendererSimple implements OnDestroy {
  @Input() surveyDefinition: string = '';
  @Output() surveyDefinitionChange = new EventEmitter<string>();
  @Output() applyClicked = new EventEmitter<string>();

  // Removed all the saving/loading functionality from original survey-renderer
  // Keep only the JSON editing part
  
  customCss: string = '';
  enableCssPreview: boolean = false;
  surveyModel: Model = new Model({});
  private customStyleElement: HTMLStyleElement | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnDestroy() {
    this.removeCustomStyles();
  }

  onSurveyDefinitionChange(value: string) {
    this.surveyDefinitionChange.emit(value);
  }

  onApplyClick() {
    if (this.isValidJson()) {
      this.applyClicked.emit(this.surveyDefinition);
    }
  }

  isValidJson(): boolean {
    try {
      JSON.parse(this.surveyDefinition);
      return true;
    } catch {
      return false;
    }
  }

  formatJson() {
    try {
      const parsed = JSON.parse(this.surveyDefinition);
      const formatted = JSON.stringify(parsed, null, 2);
      this.surveyDefinitionChange.emit(formatted);
    } catch {
      // Invalid JSON, don't format
    }
  }

  loadSampleSurvey() {
    const sampleSurvey = {
      "title": "Customer Feedback Survey",
      "pages": [
        {
          "name": "personalInfo",
          "elements": [
            {
              "type": "text",
              "name": "firstName", 
              "title": "First Name",
              "isRequired": true
            },
            {
              "type": "text",
              "name": "email",
              "title": "Email Address", 
              "isRequired": true,
              "inputType": "email"
            }
          ]
        },
        {
          "name": "feedback",
          "elements": [
            {
              "type": "radiogroup",
              "name": "overallSatisfaction",
              "title": "How would you rate your overall satisfaction?",
              "choices": ["Excellent", "Good", "Fair", "Poor"],
              "isRequired": true
            },
            {
              "type": "comment",
              "name": "suggestions", 
              "title": "Any suggestions for improvement?"
            }
          ]
        }
      ]
    };

    this.surveyDefinitionChange.emit(JSON.stringify(sampleSurvey, null, 2));
  }

  // Keep CSS functionality from original
  onCssPreviewToggle() {
    if (this.enableCssPreview && this.customCss.trim()) {
      this.applyCustomStyles();
    } else {
      this.removeCustomStyles();
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
}