import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: [DataSource],
    },
    UserResolver,
  ],
  exports: ['UserRepository'],
})
export class UserModule {}
