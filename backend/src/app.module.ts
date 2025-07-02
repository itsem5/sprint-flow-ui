import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { EpicsModule } from './epics/epics.module';
import { SprintsModule } from './sprints/sprints.module';
import { StoriesModule } from './stories/stories.module';
import { TasksModule } from './tasks/tasks.module';
import { Organization } from './organizations/organization.entity';
import { User } from './users/user.entity';
import { Project } from './projects/project.entity';
import { ProjectMember } from './projects/project-member.entity';
import { ProjectSuccessCriteria } from './projects/project-success-criteria.entity';
import { Epic } from './epics/epic.entity';
import { Sprint } from './sprints/sprint.entity';
import { Story } from './stories/story.entity';
import { Task } from './tasks/task.entity';
import { TaskLabel } from './tasks/task-label.entity';
import { TaskAttachment } from './tasks/task-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'palak',
      entities: [Organization, User, Project, ProjectMember, ProjectSuccessCriteria, Epic, Sprint, Story, Task, TaskLabel, TaskAttachment],
      synchronize: true,
    }),
    OrganizationsModule,
    UsersModule,
    ProjectsModule,
    EpicsModule,
    SprintsModule,
    StoriesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
