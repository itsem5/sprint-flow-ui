import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './sprint.entity';
import { CreateSprintDto, UpdateSprintDto } from './dto/sprint.dto';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
  ) {}

  create(createSprintDto: CreateSprintDto): Promise<Sprint> {
    const sprint = this.sprintsRepository.create(createSprintDto);
    return this.sprintsRepository.save(sprint);
  }

  findAll(): Promise<Sprint[]> {
    return this.sprintsRepository.find();
  }

  findOne(id: string): Promise<Sprint | null> {
    return this.sprintsRepository.findOneBy({ id });
  }

  async update(id: string, updateSprintDto: UpdateSprintDto): Promise<Sprint | null> {
    await this.sprintsRepository.update(id, updateSprintDto);
    return this.sprintsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.sprintsRepository.delete(id);
  }
}
