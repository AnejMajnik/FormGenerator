import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Survey from 'survey-angular';
import 'survey-angular/defaultV2.css';

@Component({
  selector: 'app-survey-renderer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './survey-renderer.html',
  styleUrl: './survey-renderer.css'
})
export class SurveyRenderer {
  jsonInput: string = '';

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
}
