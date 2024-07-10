import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const dbConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
  synchronize: true,
};

export default registerAs('typeorm', () => dbConfig);
export const connectionSource = new DataSource(dbConfig as DataSourceOptions);
