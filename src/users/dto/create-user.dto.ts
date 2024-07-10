import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;
}
