import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const existingOrganization = await this.organizationsRepository.findOne({ where: { name: createOrganizationDto.name } });
    if (existingOrganization) {
      throw new ConflictException('Organization with this name already exists');
    }
    const organization = this.organizationsRepository.create(createOrganizationDto);
    const newOrganization = await this.organizationsRepository.save(organization);
    await this.usersService.update(newOrganization.createdById, { organizationId: newOrganization.id });
    return newOrganization;
  }

  findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find();
  }

  findOne(id: number): Promise<Organization | null> {
    return this.organizationsRepository.findOneBy({ id });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
    await this.organizationsRepository.update(id, updateOrganizationDto);
    return this.organizationsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.organizationsRepository.delete(id);
  }

  async assignUserToOrganization(id: number, userId: number): Promise<Organization | null> {
    await this.usersService.update(userId, {
      organizationId: id,
    });
    return this.organizationsRepository.findOneBy({ id });
  }

  async searchByName(name: string): Promise<Organization[]> {
    const escapedName = name.replace(/([%_])/g, '\\$1');
    return this.organizationsRepository.createQueryBuilder('organization')
      .where('LOWER(organization.name) LIKE LOWER(:name)', { name: `%${escapedName}%` })
      .getMany();
  }
}
