import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Epic } from '../epics/epic.entity';
import { Sprint } from '../sprints/sprint.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectSuccessCriteria } from './project-success-criteria.entity';

@Entity('projects')
export class Project {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'created_by' })
  createdById: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => Epic, epic => epic.project)
  epics: Epic[];

  @OneToMany(() => Sprint, sprint => sprint.project)
  sprints: Sprint[];

  @OneToMany(() => ProjectMember, member => member.project)
  members: ProjectMember[];

  @OneToMany(() => ProjectSuccessCriteria, criteria => criteria.project)
  successCriteria: ProjectSuccessCriteria[];
}
