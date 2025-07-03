import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Model } from 'survey-core';
import { ActivatedRoute } from '@angular/router';
import 'survey-angular/defaultV2.css';
import { SurveyModule } from 'survey-angular-ui';


@Component({
  selector: 'app-survey-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, SurveyModule],
  templateUrl: './survey-viewer.html',
  styleUrl: './survey-viewer.css'
})
export class SurveyViewer implements OnInit{
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  surveyModel: Model = new Model({});
  isLoading = true;
  errorLoading = false;

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

  loadSurvey(slug: string) {
    this.http.get<any>(`/api/surveys/slug/${slug}`).subscribe({
      next: (surveyData) => {
        if (!surveyData || !surveyData.jsonData || typeof surveyData.jsonData !== 'object') {
          console.error('Invalid or empty jsonData received:', surveyData.jsonData);
          this.errorLoading = true;
          this.isLoading = false;
          return;
        }

        const survey = new Model(surveyData.jsonData);

        survey.onComplete.add((sender) => {
          console.log('Survey results:', sender.data);
          // TODO: Save results
        });

        this.surveyModel = survey;
        this.isLoading = false;

      },
      error: (err) => {
        console.error('Failed to load survey', err);
        this.isLoading = false;
        this.errorLoading = true;
      }
    });
  }
}
