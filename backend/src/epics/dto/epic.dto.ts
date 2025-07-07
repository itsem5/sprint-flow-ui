import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsDateString } from 'class-validator';
import { EpicStatus, EpicPriority } from '../epic.entity';

export class CreateEpicDto {
  @IsString()
  projectId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EpicStatus)
  status?: EpicStatus;

  @IsOptional()
  @IsEnum(EpicPriority)
  priority?: EpicPriority;


  @IsOptional()
  @IsNumber()
  assignee?: number;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsNumber()
  createdById: number;
}

export class UpdateEpicDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EpicStatus)
  status?: EpicStatus;

  @IsOptional()
  @IsEnum(EpicPriority)
  priority?: EpicPriority;

  @IsOptional()
  @IsNumber()
  assignee?: number;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

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
