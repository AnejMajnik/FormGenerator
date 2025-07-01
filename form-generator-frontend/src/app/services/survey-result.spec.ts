import { TestBed } from '@angular/core/testing';

import { SurveyResult } from './survey-result';

describe('SurveyResult', () => {
  let service: SurveyResult;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyResult);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
