import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('survey_results')
export class SurveyResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    surveyId: number;

    @Column({ type: 'jsonb' })
    results: any;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}