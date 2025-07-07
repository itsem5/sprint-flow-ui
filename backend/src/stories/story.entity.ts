import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Epic } from '../epics/epic.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

export enum StoryStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  DONE = 'Done',
}

export enum StoryPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

@Entity('stories')
export class Story {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'epic_id' })
  epicId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: StoryStatus,
    default: StoryStatus.TODO,
  })
  status: StoryStatus;

  @Column({
    type: 'enum',
    enum: StoryPriority,
    default: StoryPriority.MEDIUM,
  })
  priority: StoryPriority;

  @Column({ name: 'created_by' })
  createdById: number;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: number;

  @Column({ name: 'assignee_id', nullable: true })
  assigneeId: number;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({name:'story_points', type: 'int', nullable: true})
  storyPoints: number;

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

  @ManyToOne(() => Epic, epic => epic.stories)
  @JoinColumn({ name: 'epic_id' })
  epic: Epic;

  @ManyToOne(() => User, user => user.createdStories)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User, user => user.assignedStories)
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;
 
  @OneToMany(() => Task, task => task.story)
  tasks: Task[];
}
