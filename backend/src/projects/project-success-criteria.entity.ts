import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_success_criteria')
export class ProjectSuccessCriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Project, project => project.successCriteria)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
