import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Model } from 'survey-core';
import 'survey-angular/defaultV2.css';
import { SurveyModule } from 'survey-angular-ui';

@Component({
  selector: 'app-survey-viewer-simple',
  standalone: true,
  imports: [CommonModule, FormsModule, SurveyModule],
  templateUrl: './survey-viewer-simple.html',
  styleUrl: './survey-viewer-simple.css'
})
export class SurveyViewerSimple implements OnChanges, OnDestroy {
  @Input() surveyJson: string = '';
  @Output() pageChanged = new EventEmitter<{ currentPage: number; totalPages: number; pageName?: string }>();
  @Output() surveyCompleted = new EventEmitter<any>();

  surveyModel: Model = new Model({});
  isLoading = false;
  errorLoading = false;
  errorMessage = '';

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['surveyJson'] && this.surveyJson) {
      this.loadSurvey();
    }
  }

  ngOnDestroy() {
    // Clean up survey events
    this.surveyModel.onCurrentPageChanged.clear();
    this.surveyModel.onComplete.clear();
  }

  private loadSurvey() {
    try {
      this.errorMessage = '';
      this.errorLoading = false;
      
      // Parse the JSON (similar to your original survey-viewer)
      const surveyData = JSON.parse(this.surveyJson);
      
      // Create new survey model
      const survey = new Model(surveyData);
      
      // Set up event handlers for communication with parent
      survey.onCurrentPageChanged.add((sender, options) => {
        const currentPage = sender.currentPageNo;
        const totalPages = sender.pageCount;
        const pageName = sender.currentPage?.name;
        
        this.pageChanged.emit({
          currentPage,
          totalPages,
          pageName
        });
      });

      survey.onComplete.add((sender) => {
        this.surveyCompleted.emit(sender.data);
      });

      // Initial page emission
      survey.onAfterRenderSurvey.add((sender) => {
        const currentPage = sender.currentPageNo;
        const totalPages = sender.pageCount;
        const pageName = sender.currentPage?.name;
        
        this.pageChanged.emit({
          currentPage,
          totalPages,
          pageName
        });
      });

      this.surveyModel = survey;
      
    } catch (error) {
      this.errorMessage = 'Invalid JSON format or survey structure';
      this.errorLoading = true;
      console.error('Error loading survey:', error);
    }
  }
}