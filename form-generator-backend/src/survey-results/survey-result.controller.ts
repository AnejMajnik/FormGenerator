import { Body, Controller, Get, Param, Post, HttpStatus, HttpCode, Patch, NotFoundException } from '@nestjs/common';
import { SurveyResultService } from './survey-result.service';
import { SurveyResult } from './survey-result.entity';

@Controller('survey-results')
export class SurveyResultController {

  constructor(private readonly surveyResultService: SurveyResultService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async saveSurveyResult(@Body() body: { surveyId: number; results: any }): Promise<SurveyResult> {
    const { surveyId, results } = body;
    return this.surveyResultService.saveSurveyResult(surveyId, results);
  }

  @Get(':surveyId')
  async getSurveyResults(@Param('surveyId') surveyId: number): Promise<SurveyResult[]> {
    return this.surveyResultService.getSurveyResults(surveyId);
  }

  @Get()
  async findAll() {
    return this.surveyResultService.findAll();
  }

  @Patch(':id')
  async updateSurveyResult(
    @Param('id') id: number,
    @Body() body: { results: any }
  ): Promise<SurveyResult> {
    // Ensure the ID is a number
    const resultId = Number(id);
    if (isNaN(resultId)) {
      throw new NotFoundException('Invalid SurveyResult ID provided.');
    }
    return this.surveyResultService.updateSurveyResult(resultId, body.results);
  }

}