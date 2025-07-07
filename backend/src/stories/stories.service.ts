import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from './story.entity';
import { CreateStoryDto, UpdateStoryDto } from './dto/story.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  create(createStoryDto: CreateStoryDto): Promise<Story> {
    const story = this.storiesRepository.create({
      id: uuidv4(),
      ...createStoryDto,
    });
    return this.storiesRepository.save(story);
  }

  findAll(): Promise<Story[]> {
    return this.storiesRepository.find({ relations: ['creator', 'assignee'] });
  }

  findOne(id: string): Promise<Story | null> {
    return this.storiesRepository.findOne({ where: { id }, relations: ['creator', 'assignee'] });
  }

  async update(id: string, updateStoryDto: UpdateStoryDto): Promise<Story | null> {
    await this.storiesRepository.update(id, updateStoryDto);
    return this.storiesRepository.findOne({ where: { id }, relations: ['creator', 'assignee'] });
  }

  async remove(id: string): Promise<void> {
    await this.storiesRepository.delete(id);
  }
}
