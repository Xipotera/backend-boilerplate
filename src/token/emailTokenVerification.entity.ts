import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../global/entitiy/BaseEntity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('email_token_verification')
export class EmailTokenVerificationEntity extends BaseEntity {
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  @Field({ nullable: true })
  public email: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  @Field({ nullable: true })
  public token: string;
}
