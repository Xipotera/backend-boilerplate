import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from './data-source';
import { EnvController } from './env/env.controller';
import { EnvService } from './env/env.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomExceptionFilter } from './global/CustomExceptionFilter';
import { APP_FILTER } from '@nestjs/core';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
      isGlobal: true, // makes ConfigModule globally available
    }),
    TypeOrmModule, // Import custom TypeOrmModule
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [
    Logger,
    EnvService,

    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
  controllers: [EnvController],
})
export class AppModule {}
