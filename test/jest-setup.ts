import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

let app: INestApplication;
let dataSource: DataSource;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, ConfigModule.forRoot()],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  dataSource = app.get<DataSource>(DataSource);
});

afterAll(async () => {
  // Drop the database after tests
  if (dataSource) {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  }
  await app.close();
});

export { app };
