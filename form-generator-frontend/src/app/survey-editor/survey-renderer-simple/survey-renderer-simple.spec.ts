import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyRendererSimple } from './survey-renderer-simple';

describe('SurveyRendererSimple', () => {
  let component: SurveyRendererSimple;
  let fixture: ComponentFixture<SurveyRendererSimple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyRendererSimple]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyRendererSimple);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
