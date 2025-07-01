import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './survey.entity';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private surveysRepository: Repository<Survey>,
  ) {}

  async create(name: string, slug: string, jsonData: any): Promise<{ message: string; surveyId: number }> {
    const survey = this.surveysRepository.create({ name, slug, jsonData });
    await this.surveysRepository.save(survey);
    return { message: 'Survey created successfully', surveyId: survey.id };
  }

  async findOneByName(name: string): Promise<any> {
    const survey = await this.surveysRepository.findOne({ where: { name } });
    if (!survey) {
      throw new NotFoundException(`Survey with name "${name}" not found`);
    }
    return survey.jsonData;
  }

  async findOneBySlug(slug: string): Promise<any> {
    const survey = await this.surveysRepository.findOne({ where: { slug } });
    if (!survey) {
      throw new NotFoundException(`Survey with slug "${slug}" not found`);
    }
    return survey.jsonData;
  }

  async findAll(): Promise<Survey[]> {
    return this.surveysRepository.find();
  }
}