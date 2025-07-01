import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SurveyResultData {
  surveyId: number; // The ID of the survey definition this result belongs to
  results: any;     // JSON data of the survey answers
}

interface SavedSurveyResult {
  id: number;
  surveyId: number;
  results: any;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyResult {
  private apiUrl = 'http://localhost:3000/survey-results';

  constructor(private http: HttpClient) { }

  saveSurveyResult(resultData: SurveyResultData): Observable<SavedSurveyResult> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<SavedSurveyResult>(this.apiUrl, resultData, httpOptions);
  }

  updateSurveyResult(id: number, results: any): Observable<SavedSurveyResult> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.patch<SavedSurveyResult>(`${this.apiUrl}/${id}`, { results }, httpOptions);
  }
}
