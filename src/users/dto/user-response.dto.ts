import { ObjectType, Field } from '@nestjs/graphql';
import { GraphqlResponse } from '../../global/graphql-response.dto';

@ObjectType()
export class UserResponse extends GraphqlResponse {
  @Field()
  id: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;
}
