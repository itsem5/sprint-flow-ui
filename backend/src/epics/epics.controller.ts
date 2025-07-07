import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { EpicsService } from './epics.service';
import { CreateEpicDto, UpdateEpicDto } from './dto/epic.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('epics')
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) {}

  @Post()
  create(@Body() createEpicDto: CreateEpicDto) {
    return this.epicsService.create(createEpicDto);
  }

  @Get()
  findAll() {
    return this.epicsService.findAll();
  }

  @Get('project/:projectId')
  findAllByProject(@Param('projectId') projectId: string, @Query('search') search: string) {
    return this.epicsService.findAllByProject(projectId, search);
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
