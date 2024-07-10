import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GraphqlResponse {
  @Field()
  message: string;

  @Field()
  status: number;
}
