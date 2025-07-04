import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('survey_results')
export class SurveyResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    surveyId: number;

    @Column({ type: 'jsonb' })
    results: any;

    @Column({ nullable: true })
    sessionId: string;

    @Column({ nullable: true })
    userId: string;

    @Column({ default: 0 })
    currentPageNo: number;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}