import { Resolver, Query } from '@nestjs/graphql';
import { ProjectService } from './project.service.js';
import { ProjectModel } from './models/project.model.js';

@Resolver(() => ProjectModel)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [ProjectModel], { name: 'projects' })
  async getProjects(): Promise<ProjectModel[]> {
    return this.projectService.findAll();
  }
}
