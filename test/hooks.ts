import { After, Before } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import 'reflect-metadata';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

let app: INestApplication;
let dataSource: DataSource;

Before(async () => {
  try {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
    dataSource = app.get<DataSource>(DataSource);

    await app.listen(2000);

    global['app'] = app;
  } catch (error) {
    console.error('Error during setup:', error);
    throw error;
  }
});

After(async () => {
  try {
    // Drop the database after tests
    if (dataSource) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
    await app.close();
  } catch (error) {
    console.error('Error during teardown:', error);
    throw error;
  }
});
