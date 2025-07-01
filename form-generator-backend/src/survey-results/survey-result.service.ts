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

  async saveSurveyResult(surveyId: number, results: any): Promise<SurveyResult> {
    const surveyResult = this.surveyResultRepository.create({ surveyId, results });
    return this.surveyResultRepository.save(surveyResult);
  }

  async getSurveyResults(surveyId: number): Promise<SurveyResult[]> {
    return this.surveyResultRepository.find({ where: { surveyId } });
  }

  async findAll(): Promise<SurveyResult[]> {
      return this.surveyResultRepository.find();
    }

    async updateSurveyResult(id: number, results: any): Promise<SurveyResult> {
        const surveyResult = await this.surveyResultRepository.findOne({ where: { id } });

        if (!surveyResult) {
        throw new NotFoundException(`SurveyResult with ID ${id} not found.`);
        }

        surveyResult.results = results; // Overwrite the results JSON
        return this.surveyResultRepository.save(surveyResult); // Save updates the existing entity
    }

}