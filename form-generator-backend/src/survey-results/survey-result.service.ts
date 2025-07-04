import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyResult } from './survey-result.entity';

@Injectable()
export class SurveyResultService {
  constructor(
    @InjectRepository(SurveyResult)
    private surveyResultRepository: Repository<SurveyResult>,
  ) {}

  async saveSurveyResult(surveyId: number, results: any, sessionId?: string, userId?: string, currentPageNo?: number): Promise<SurveyResult> {
    const surveyResult = this.surveyResultRepository.create({ 
      surveyId, 
      results, 
      sessionId,
      userId,
      currentPageNo: currentPageNo || 0,
      isCompleted: false
    });
    return this.surveyResultRepository.save(surveyResult);
  }

  async getSurveyResults(surveyId: number): Promise<SurveyResult[]> {
    return this.surveyResultRepository.find({ where: { surveyId } });
  }

  async findAll(): Promise<SurveyResult[]> {
    return this.surveyResultRepository.find();
  }

  async updateSurveyResult(id: number, results: any, currentPageNo?: number, isCompleted?: boolean): Promise<SurveyResult> {
    const surveyResult = await this.surveyResultRepository.findOne({ where: { id } });

    if (!surveyResult) {
      throw new NotFoundException(`SurveyResult with ID ${id} not found.`);
    }

    surveyResult.results = results;
    if (currentPageNo !== undefined) {
      surveyResult.currentPageNo = currentPageNo;
    }
    if (isCompleted !== undefined) {
      surveyResult.isCompleted = isCompleted;
    }
    surveyResult.updatedAt = new Date();

    return this.surveyResultRepository.save(surveyResult);
  }

  async getIncompleteResult(surveyId: number, sessionId?: string, userId?: string): Promise<SurveyResult | null> {
    const whereCondition: any = {
      surveyId,
      isCompleted: false  // Only get incomplete surveys
    };

    // Prefer userId if available, otherwise use sessionId
    if (userId && userId.trim()) {
      whereCondition.userId = userId;
    } else if (sessionId && sessionId.trim()) {
      whereCondition.sessionId = sessionId;
    } else {
      return null;
    }

    const result = await this.surveyResultRepository.findOne({ 
      where: whereCondition,
      order: { updatedAt: 'DESC' } // Get most recent incomplete result
    });
  
    return result;
  }

  async completeSurvey(id: number, finalResults: any): Promise<SurveyResult> {
    const surveyResult = await this.surveyResultRepository.findOne({ where: { id } });

    if (!surveyResult) {
      throw new NotFoundException(`SurveyResult with ID ${id} not found.`);
    }

    surveyResult.results = finalResults;
    surveyResult.isCompleted = true;
    surveyResult.updatedAt = new Date();

    return this.surveyResultRepository.save(surveyResult);
  }

}