import { Resolver, Query, Args } from '@nestjs/graphql';
import { SkillService } from './skill.service.js';
import { SkillModel } from './models/skill.model.js';
import { SkillCategory } from '../../generated/prisma/client.js';

@Resolver(() => SkillModel)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @Query(() => [SkillModel], { name: 'skills' })
  async getSkills(
    @Args('category', { type: () => SkillCategory, nullable: true })
    category?: SkillCategory,
  ): Promise<SkillModel[]> {
    return this.skillService.findAll(category);
  }
}
