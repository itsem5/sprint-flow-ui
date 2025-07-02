import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Epic } from '../epics/epic.entity';
import { Task } from '../tasks/task.entity';

@Entity('stories')
export class Story {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'epic_id' })
  epicId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Epic, epic => epic.stories)
  @JoinColumn({ name: 'epic_id' })
  epic: Epic;

  @OneToMany(() => Task, task => task.story)
  tasks: Task[];
}
