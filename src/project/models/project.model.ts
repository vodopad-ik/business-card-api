import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Project or repository' })
export class ProjectModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  repositoryUrl?: string | null;

  @Field(() => String)
  profileId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
