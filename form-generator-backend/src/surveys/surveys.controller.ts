import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveysService } from './surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  async create(@Body() body: { name: string; jsonData: any }) {
    return this.surveysService.create(body.name, body.jsonData);
  }

  @Get(':name')
  async findOneByName(@Param('name') name: string) {
    return this.surveysService.findOneByName(name);
  }

  @Get()
  async findAll() {
    return this.surveysService.findAll();
  }
}