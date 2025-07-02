import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Story } from '../stories/story.entity';

@Entity('epics')
export class Epic {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Project, project => project.epics)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Story, story => story.epic)
  stories: Story[];
}
