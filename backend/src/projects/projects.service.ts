import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectSuccessCriteria } from './project-success-criteria.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private projectMembersRepository: Repository<ProjectMember>,
    @InjectRepository(ProjectSuccessCriteria)
    private projectSuccessCriteriaRepository: Repository<ProjectSuccessCriteria>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { members, successCriteria, ...projectData } = createProjectDto;
    const project = this.projectsRepository.create(projectData);
    const savedProject = await this.projectsRepository.save(project) as Project;

    if (members) {
      const projectMembers = members.map(userId => this.projectMembersRepository.create({ projectId: savedProject.id, userId }));
      await this.projectMembersRepository.save(projectMembers);
    }

    if (successCriteria) {
      const projectSuccessCriteria = successCriteria.map(description => this.projectSuccessCriteriaRepository.create({ projectId: savedProject.id, description }));
      await this.projectSuccessCriteriaRepository.save(projectSuccessCriteria);
    }

    return savedProject;
  }

  findAll(): Promise<Project[]> {
    return this.projectsRepository.find({ relations: ['members', 'successCriteria'] });
  }

  findOne(id: string): Promise<Project | null> {
    return this.projectsRepository.findOne({ where: { id }, relations: ['members', 'successCriteria'] });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project | null> {
    await this.projectsRepository.update(id, updateProjectDto);
    return this.projectsRepository.findOne({ where: { id }, relations: ['members', 'successCriteria'] });
  }

  async remove(id: string): Promise<void> {
    await this.projectsRepository.delete(id);
  }
}
