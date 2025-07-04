import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epic } from './epic.entity';
import { CreateEpicDto, UpdateEpicDto } from './dto/epic.dto';

@Injectable()
export class EpicsService {
  constructor(
    @InjectRepository(Epic)
    private epicsRepository: Repository<Epic>,
  ) {}

  create(createEpicDto: CreateEpicDto): Promise<Epic> {
    const epic = this.epicsRepository.create(createEpicDto);
    return this.epicsRepository.save(epic);
  }

  findAll(): Promise<Epic[]> {
    return this.epicsRepository.find({
      relations: ['project', 'creator', 'assignee'],
    });
  }

  findOne(id: string): Promise<Epic | null> {
    return this.epicsRepository.findOne({
      where: { id },
      relations: ['project', 'creator', 'assignee'],
    });
  }

  async update(id: string, updateEpicDto: UpdateEpicDto): Promise<Epic | null> {
    await this.epicsRepository.update(id, updateEpicDto);
    return this.epicsRepository.findOne({
      where: { id },
      relations: ['project', 'creator', 'assignee'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.epicsRepository.delete(id);
  }
}
