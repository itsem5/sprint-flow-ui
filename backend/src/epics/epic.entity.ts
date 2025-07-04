import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Story } from '../stories/story.entity';
import { User } from '../users/user.entity';

export enum EpicStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export enum EpicPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

@Entity('epics')
export class Epic {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EpicStatus,
    default: EpicStatus.NOT_STARTED,
  })
  status: EpicStatus;

  @Column({
    type: 'enum',
    enum: EpicPriority,
    default: EpicPriority.MEDIUM,
  })
  priority: EpicPriority;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => Project, project => project.epics)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.createdEpics)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User, user => user.assignedEpics)
  @JoinColumn({ name: 'assigned_to' })
  assignee: User;

  @OneToMany(() => Story, story => story.epic)
  stories: Story[];
}
