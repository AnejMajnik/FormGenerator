import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SurveyRenderer } from './survey-renderer/survey-renderer';
import { CommonModule } from '@angular/common';
import { SurveyViewer } from './survey-viewer/survey-viewer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SurveyRenderer, CommonModule, FormsModule, SurveyViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'form-generator-frontend';
}
