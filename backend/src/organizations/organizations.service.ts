import { Injectable, Inject } from '@nestjs/common';
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

  create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationsRepository.create(createOrganizationDto);
    return this.organizationsRepository.save(organization);
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
}
