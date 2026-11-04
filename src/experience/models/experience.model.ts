import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '../../../generated/prisma/enums.js';

@ObjectType({ description: 'Commercial work experience' })
export class ExperienceModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  company: string;

  @Field(() => String)
  position: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field(() => [String])
  achievements: String[];

  @Field(() => String)
  profileId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
