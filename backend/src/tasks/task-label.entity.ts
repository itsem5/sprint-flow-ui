import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_labels')
export class TaskLabel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_id' })
  taskId: string;

  @Column()
  label: string;

  @ManyToOne(() => Task, task => task.labels)
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
