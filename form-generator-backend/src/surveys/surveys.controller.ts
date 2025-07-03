import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SurveysService } from './surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  async create(@Body() body: { name: string; jsonData: any; slug: string; customCss?: string }) {
    return this.surveysService.create(body.name, body.slug, body.jsonData, body.customCss);
  }

  @Get('by-name/:name')
  async findOneByName(@Param('name') name: string) {
    return this.surveysService.findOneByName(name);
  }

  @Get('slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    return this.surveysService.findOneBySlug(slug);
  }

  @Get()
  async findAll() {
    return this.surveysService.findAll();
  }
}