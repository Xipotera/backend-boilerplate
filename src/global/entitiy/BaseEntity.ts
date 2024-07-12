import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType({ isAbstract: true })
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field({ nullable: true })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field({ nullable: true })
  public updatedAt: Date;
}
