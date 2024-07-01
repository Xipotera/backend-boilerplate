import { DataSource } from 'typeorm';

export async function createDatabaseIfNotExists(dataSource: DataSource) {
  console.log('Creating database if it does not exist');
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  const databaseName = dataSource.options.database;
  console.log(`Database ${databaseName} `);
  const dbExists = await queryRunner.hasDatabase(databaseName as string);

  if (!dbExists) {
    await queryRunner.createDatabase(databaseName as string, true);
    console.log(`Database ${databaseName} created successfully`);
  }

  await queryRunner.release();
}
