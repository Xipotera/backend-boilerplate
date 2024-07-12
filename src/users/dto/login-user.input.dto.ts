import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginUserInputDto {
  @Field()
  email: string;

  @Field()
  password: string;
}
