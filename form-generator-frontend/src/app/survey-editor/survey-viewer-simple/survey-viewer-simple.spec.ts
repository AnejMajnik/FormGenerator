import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyViewerSimple } from './survey-viewer-simple';

describe('SurveyViewerSimple', () => {
  let component: SurveyViewerSimple;
  let fixture: ComponentFixture<SurveyViewerSimple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyViewerSimple]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyViewerSimple);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
