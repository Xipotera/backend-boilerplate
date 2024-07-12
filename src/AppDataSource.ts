import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Configuration } from './utils';

export const AppDataSource = new DataSource(Configuration.database);
