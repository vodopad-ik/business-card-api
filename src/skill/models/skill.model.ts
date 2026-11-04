import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '../../../generated/prisma/enums.js';

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Categories of professional skills',
});

@ObjectType({ description: 'Technical skill' })
export class SkillModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => SkillCategory)
  category: SkillCategory;

  @Field(() => String)
  profileId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
