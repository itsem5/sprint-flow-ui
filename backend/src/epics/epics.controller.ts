import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EpicsService } from './epics.service';
import { CreateEpicDto, UpdateEpicDto } from './dto/epic.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('epics')
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) {}

  @Post()
  create(@Body() createEpicDto: CreateEpicDto) {
    // For now, we'll use a dummy user ID for createdBy
    const createdBy = 'user-1'; // Replace with actual user ID from authentication context
    const id = uuidv4();
    return this.epicsService.create({ ...createEpicDto, createdBy });
  }

  @Get()
  findAll() {
    return this.epicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.epicsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEpicDto: UpdateEpicDto) {
    return this.epicsService.update(id, updateEpicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.epicsService.remove(id);
  }
}
