import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEditor } from './survey-editor';

describe('SurveyEditor', () => {
  let component: SurveyEditor;
  let fixture: ComponentFixture<SurveyEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
