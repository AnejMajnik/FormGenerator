import { Routes } from '@angular/router';
import { SurveyViewer } from './survey-viewer/survey-viewer';
import { SurveyRenderer } from './survey-renderer/survey-renderer';
import { SurveyEditorComponent } from './survey-editor/survey-editor';

export const routes: Routes = [
    { path: '', redirectTo: '/survey-designer', pathMatch: 'full' },
    {
        path: 'surveys/slug/:slug',
        component: SurveyViewer
    },
    {
    path: 'survey-designer',
    component: SurveyRenderer
    },
    {
      path: 'survey-editor',
      component: SurveyEditorComponent
    },
];
