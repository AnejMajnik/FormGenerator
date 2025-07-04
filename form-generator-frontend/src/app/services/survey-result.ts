import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SurveyResultData {
  surveyId: number;
  results: any;
  sessionId?: string;
  userId?: string;
  currentPageNo?: number;
}

interface SurveyResultResponse {
  id: number;
  surveyId: number;
  results: any;
  sessionId?: string;
  userId?: string;
  currentPageNo: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyResult {
  private apiUrl = 'http://localhost:3000/api/survey-results';

  constructor(private http: HttpClient) { }

  saveSurveyResult(surveyResult: SurveyResultData): Observable<SurveyResultResponse> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<SurveyResultResponse>(this.apiUrl, surveyResult, httpOptions);
  }

  updateSurveyResult(id: number, results: any, currentPageNo?: number, isCompleted?: boolean): Observable<SurveyResultResponse> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    
    const updateData: any = { results };
    if (currentPageNo !== undefined) {
      updateData.currentPageNo = currentPageNo;
    }
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
    }
    
    return this.http.patch<SurveyResultResponse>(`${this.apiUrl}/${id}`, updateData, httpOptions);
  }

  getIncompleteResult(surveyId: number, sessionId?: string, userId?: string): Observable<SurveyResultResponse | null> {
    let params = '';
    if (userId) {
      params = `?userId=${userId}`;
    } else if (sessionId) {
      params = `?sessionId=${sessionId}`;
    }
    
    return this.http.get<SurveyResultResponse | null>(`${this.apiUrl}/incomplete/${surveyId}${params}`);
  }

  completeSurvey(id: number, results: any): Observable<SurveyResultResponse> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.patch<SurveyResultResponse>(`${this.apiUrl}/${id}/complete`, { results }, httpOptions);
  }
}
