import { IsString, IsOptional, IsEnum, IsArray, IsDateString, IsUUID } from 'class-validator';
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

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

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
  @IsString()
  assignedTo?: string;

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
