import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyViewer } from './survey-viewer';

describe('SurveyViewer', () => {
  let component: SurveyViewer;
  let fixture: ComponentFixture<SurveyViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
