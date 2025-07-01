import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveysModule } from './surveys/surveys.module';
import { Survey } from './surveys/survey.entity';
import { SurveyResultsModule } from './survey-results/survey-results.module';
import { SurveyResult } from './survey-results/survey-result.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dev',
      password: 'password',
      database: 'form-generator.db',
      synchronize: true,
      entities: [Survey, SurveyResult],
    }),
    SurveysModule,
    SurveyResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}