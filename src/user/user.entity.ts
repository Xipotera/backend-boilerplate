import { Entity, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../global/entitiy/BaseEntity';

@ObjectType({ isAbstract: true })
@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'text',
    unique: true,
  })
  @Field({ nullable: true })
  public email: string;

  @Column({
    type: 'text',
  })
  public password: string;

  @Column({
    type: 'text',
    unique: true,
  })
  @Field({ nullable: true })
  public username: string;

  @Column({ default: false })
  @Field({ nullable: true })
  public isVerified: boolean;

  @Column({ default: false })
  @Field({ nullable: true })
  public isActive: boolean;
}
