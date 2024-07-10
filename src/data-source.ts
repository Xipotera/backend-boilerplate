import { DataSource } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Global, Module, Logger } from '@nestjs/common';
import { User } from './users/user.entity';
import { join } from 'path';

const createDataSource = async (
  configService: ConfigService,
  logger: Logger,
): Promise<DataSource> => {
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get<string>('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USERNAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
      entities: [User],
      migrations: [join(__dirname, 'migrations/*.{ts,js}')],
      synchronize: false,
    });
    await dataSource.initialize();
    logger.log('Database connected successfully');
    return dataSource;
  } catch (error) {
    logger.error('Error connecting to the database', error);
    throw error;
  }
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    Logger,
    {
      provide: DataSource,
      useFactory: async (configService: ConfigService, logger: Logger) =>
        createDataSource(configService, logger),
      inject: [ConfigService, Logger],
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
