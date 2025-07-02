import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskLabel } from './task-label.entity';
import { TaskAttachment } from './task-attachment.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private taskLabelsRepository: Repository<TaskLabel>,
    @InjectRepository(TaskAttachment)
    private taskAttachmentsRepository: Repository<TaskAttachment>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { labels, attachments, ...taskData } = createTaskDto;
    const task = this.tasksRepository.create(taskData);
    const savedTask = await this.tasksRepository.save(task) as Task;

    if (labels) {
      const taskLabels = labels.map(label => this.taskLabelsRepository.create({ taskId: savedTask.id, label }));
      await this.taskLabelsRepository.save(taskLabels);
    }

    if (attachments) {
      const taskAttachments = attachments.map(fileUrl => this.taskAttachmentsRepository.create({ taskId: savedTask.id, fileUrl }));
      await this.taskAttachmentsRepository.save(taskAttachments);
    }

    return savedTask;
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['labels', 'attachments', 'story', 'assignee', 'reporter', 'parentTask', 'childTasks'] });
  }

  findOne(id: string): Promise<Task | null> {
    return this.tasksRepository.findOne({ where: { id }, relations: ['labels', 'attachments', 'story', 'assignee', 'reporter', 'parentTask', 'childTasks'] });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    await this.tasksRepository.update(id, updateTaskDto);
    return this.tasksRepository.findOne({ where: { id }, relations: ['labels', 'attachments', 'story', 'assignee', 'reporter', 'parentTask', 'childTasks'] });
  }

  async remove(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
