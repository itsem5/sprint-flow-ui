import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['organization'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id }, relations: ['organization'] });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email }, relations: ['organization'] });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('LOWER(user.firstName) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(user.lastName) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(user.email) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();
  }

  async searchUsersInOrganization(organizationId: number, userName: string): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('user.organizationId = :organizationId', { organizationId });

    if (userName) {
      const escapedUserName = userName.replace(/([%_])/g, '\\$1');
      queryBuilder.andWhere('(LOWER(user.firstName) LIKE LOWER(:userName) OR LOWER(user.lastName) LIKE LOWER(:userName))', { userName: `%${escapedUserName}%` });
    }

    return queryBuilder.getMany();
  }
}
