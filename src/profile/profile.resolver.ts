import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ProfileModel } from './models/profile.model.js';
import { ProfileService } from './profile.service.js';
import { SocialLinkModel } from './models/social-link.model.js';
import { SkillModel } from '../skill/models/skill.model.js';
import { ExperienceModel } from '../experience/models/experience.model.js';
import { ProjectModel } from '../project/models/project.model.js';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, { name: 'profile', nullable: true })
  async findProfile(): Promise<ProfileModel | null> {
    return this.profileService.findProfile();
  }

  @ResolveField(() => [SocialLinkModel])
  async socialLinks(
    @Parent() profile: ProfileModel,
  ): Promise<SocialLinkModel[]> {
    return this.profileService.getSocialLinks(profile.id);
  }

  @ResolveField(() => [SkillModel])
  async skills(@Parent() profile: ProfileModel): Promise<SkillModel[]> {
    return this.profileService.getSkills(profile.id);
  }

  @ResolveField(() => [ExperienceModel])
  async experience(
    @Parent() profile: ProfileModel,
  ): Promise<ExperienceModel[]> {
    return this.profileService.getExperience(profile.id);
  }

  @ResolveField(() => [ProjectModel])
  async projects(@Parent() profile: ProfileModel): Promise<ProjectModel[]> {
    return this.profileService.getProjects(profile.id);
  }
}
