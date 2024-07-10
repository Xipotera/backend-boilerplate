import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginUserDto {
  @Field()
  email: string;

  @Field()
  password: string;
}
