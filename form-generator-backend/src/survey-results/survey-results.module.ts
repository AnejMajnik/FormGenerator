import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyResultController } from './survey-result.controller';
import { SurveyResultService } from './survey-result.service';
import { SurveyResult } from './survey-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyResult])],
  controllers: [SurveyResultController],
  providers: [SurveyResultService],
  exports: [SurveyResultService]
})
export class SurveyResultsModule {}