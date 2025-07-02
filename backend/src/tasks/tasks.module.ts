import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskLabel } from './task-label.entity';
import { TaskAttachment } from './task-attachment.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskLabel, TaskAttachment])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
