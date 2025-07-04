import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Get('search/:name')
  search(@Param('name') name: string) {
    return this.organizationsService.searchByName(name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }

  @Patch(':id/assign-user/:userId')
  assignUserToOrganization(@Param('id') id: string, @Param('userId') userId: string) {
    return this.organizationsService.assignUserToOrganization(+id, +userId);
  }
}
