import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '../../../generated/prisma/enums.js';

@ObjectType({ description: 'Professional social link or profile' })
export class SocialLinkModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  platform: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  profileId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
