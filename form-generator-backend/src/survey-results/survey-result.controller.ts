import { Body, Controller, Get, Param, Post, HttpStatus, HttpCode, Patch, NotFoundException, Query } from '@nestjs/common';
import { SurveyResultService } from './survey-result.service';
import { SurveyResult } from './survey-result.entity';

@Controller('survey-results')
export class SurveyResultController {

  constructor(private readonly surveyResultService: SurveyResultService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async saveSurveyResult(@Body() body: { 
    surveyId: number; 
    results: any; 
    sessionId?: string; 
    userId?: string;
    currentPageNo?: number;
  }): Promise<SurveyResult> {
    const { surveyId, results, sessionId, userId, currentPageNo } = body;
    return this.surveyResultService.saveSurveyResult(surveyId, results, sessionId, userId, currentPageNo);
  }

  @Get(':surveyId')
  async getSurveyResults(@Param('surveyId') surveyId: number): Promise<SurveyResult[]> {
    return this.surveyResultService.getSurveyResults(surveyId);
  }

  @Get()
  async findAll() {
    return this.surveyResultService.findAll();
  }

  @Get('incomplete/:surveyId')
  async getIncompleteResult(
    @Param('surveyId') surveyId: number,
    @Query('sessionId') sessionId?: string,
    @Query('userId') userId?: string
  ): Promise<SurveyResult | null> {
    if (!sessionId && !userId) {
      throw new NotFoundException('Either sessionId or userId must be provided');
    }
    
    return this.surveyResultService.getIncompleteResult(surveyId, sessionId, userId);
  }

  @Patch(':id')
  async updateSurveyResult(
    @Param('id') id: number,
    @Body() body: { results: any; currentPageNo?: number; isCompleted?: boolean }
  ): Promise<SurveyResult> {
    const resultId = Number(id);
    if (isNaN(resultId)) {
      throw new NotFoundException('Invalid SurveyResult ID provided.');
    }
    return this.surveyResultService.updateSurveyResult(resultId, body.results, body.currentPageNo, body.isCompleted);
  }

  @Patch(':id/complete')
  async completeSurvey(
    @Param('id') id: number,
    @Body() body: { results: any }
  ): Promise<SurveyResult> {
    const resultId = Number(id);
    if (isNaN(resultId)) {
      throw new NotFoundException('Invalid SurveyResult ID provided.');
    }
    return this.surveyResultService.completeSurvey(resultId, body.results);
  }

}