import { IsString, IsOptional } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  id: string;

  @IsString()
  epicId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
