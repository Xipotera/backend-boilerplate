import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../global/entitiy/BaseEntity';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Column({
    type: 'text',
    unique: true,
  })
  @Field({ nullable: true })
  public email: string;

  @Exclude()
  @Column({
    type: 'text',
  })
  public password: string;

  @Column({
    type: 'text',
    unique: false,
  })
  @Field({ nullable: true })
  public firstname: string;

  @Column({
    type: 'text',
    unique: false,
  })
  @Field({ nullable: true })
  public lastname: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  public isVerified = false;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  public isActive = true;

  @BeforeInsert()
  @BeforeUpdate()
  public emailToLowerCase(): void {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
