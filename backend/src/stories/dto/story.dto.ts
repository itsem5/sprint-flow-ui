import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsDateString } from 'class-validator';
import { StoryStatus, StoryPriority } from '../story.entity';

export class CreateStoryDto {
  @IsString()
  projectId: string;

  @IsString()
  epicId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;

  @IsOptional()
  @IsEnum(StoryPriority)
  priority?: StoryPriority;

  @IsNumber()
  createdById: number;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;

  @IsOptional()
  @IsNumber()
  assigneeId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  storyPoints?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;

  @IsOptional()
  @IsEnum(StoryPriority)
  priority?: StoryPriority;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;

  @IsOptional()
  @IsNumber()
  assigneeId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  storyPoints?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
