import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectSuccessCriteria } from './project-success-criteria.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember, ProjectSuccessCriteria])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
