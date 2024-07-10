import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';

@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id: string;

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

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field({ nullable: true })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field({ nullable: true })
  public updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  public emailToLowerCase(): void {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
