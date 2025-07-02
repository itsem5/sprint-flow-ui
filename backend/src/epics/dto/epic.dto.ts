import { IsString, IsOptional } from 'class-validator';

export class CreateEpicDto {
  @IsString()
  id: string;

  @IsString()
  projectId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateEpicDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
