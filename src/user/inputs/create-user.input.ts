import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  public username: string;

  @Field()
  public email: string;

  @Field()
  public password: string;

  @Field({ defaultValue: false })
  public isVerified?: boolean;

  @Field({ defaultValue: true })
  public isActive?: boolean;
}
