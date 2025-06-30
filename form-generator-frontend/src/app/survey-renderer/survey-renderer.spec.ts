import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyRenderer } from './survey-renderer';

describe('SurveyRenderer', () => {
  let component: SurveyRenderer;
  let fixture: ComponentFixture<SurveyRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
