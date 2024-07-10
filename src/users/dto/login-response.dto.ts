import { ObjectType, Field } from '@nestjs/graphql';
import { GraphqlResponse } from '../../global/graphql-response.dto';

@ObjectType()
export class LoginResponse extends GraphqlResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}
