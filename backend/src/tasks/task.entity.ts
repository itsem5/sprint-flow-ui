import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Story } from '../stories/story.entity';
import { User } from '../users/user.entity';
import { TaskLabel } from './task-label.entity';
import { TaskAttachment } from './task-attachment.entity';

@Entity('tasks')
export class Task {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'story_id' })
  storyId: string;

  @Column({ name: 'parent_task_id', nullable: true })
  parentTaskId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'task' })
  type: string;

  @Column({ default: 'todo' })
  status: string;

  @Column({ default: 'medium' })
  priority: string;

  @Column({ name: 'story_points', nullable: true })
  storyPoints: number;

  @Column({ name: 'assignee_id', nullable: true })
  assigneeId: string;

  @Column({ name: 'reporter_id' })
  reporterId: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => Story, story => story.tasks)
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @ManyToOne(() => Task, task => task.childTasks)
  @JoinColumn({ name: 'parent_task_id' })
  parentTask: Task;

  @OneToMany(() => Task, task => task.parentTask)
  childTasks: Task[];

  @ManyToOne(() => User, user => user.assignedTasks)
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @ManyToOne(() => User, user => user.reportedTasks)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @OneToMany(() => TaskLabel, label => label.task)
  labels: TaskLabel[];

  @OneToMany(() => TaskAttachment, attachment => attachment.task)
  attachments: TaskAttachment[];
}
