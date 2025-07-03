import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SurveyData {
  name: string;
  jsonData: any;
  slug: string;
  customCss?: string;
}

interface SurveyResponse {
  id: number;
  name: string;
  slug: string;
  jsonData: any;
  customCss?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'http://localhost:3000/api/surveys';

  constructor(private http: HttpClient) { }

  saveSurvey(survey: SurveyData): Observable<SurveyResponse> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<SurveyResponse>(this.apiUrl, survey, httpOptions);
  }

  
}
