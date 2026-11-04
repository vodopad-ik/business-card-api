import { Resolver, Query } from '@nestjs/graphql';
import { ExperienceService } from './experience.service.js';
import { ExperienceModel } from './models/experience.model.js';

@Resolver(() => ExperienceModel)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @Query(() => [ExperienceModel], { name: 'experience' })
  async getExperience(): Promise<ExperienceModel[]> {
    return this.experienceService.findAll();
  }
}
