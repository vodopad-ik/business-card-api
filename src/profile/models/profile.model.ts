import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SocialLinkModel } from './social-link.model.js';
import { SkillModel } from '../../skill/models/skill.model.js';
import { ExperienceModel } from '../../experience/models/experience.model.js';
import { ProjectModel } from '../../project/models/project.model.js';

@ObjectType({ description: 'Professional profile' })
export class ProfileModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  location: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;

  @Field(() => [SocialLinkModel])
  socialLinks?: SocialLinkModel[];

  @Field(() => [SkillModel])
  skills?: SkillModel[];

  @Field(() => [ExperienceModel])
  experience?: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects?: ProjectModel[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
