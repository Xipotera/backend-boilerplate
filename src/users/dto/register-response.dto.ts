import { ObjectType, Field } from '@nestjs/graphql';
import { GraphqlResponse } from '../../global/graphql-response.dto';

@ObjectType()
export class RegisterResponse extends GraphqlResponse {
  @Field()
  id: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  token?: string;
}
