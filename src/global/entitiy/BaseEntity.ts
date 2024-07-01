import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType({ isAbstract: true })
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field({ nullable: true })
  public id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field({ nullable: true })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Field({ nullable: true })
  public updated_at: Date;
}
