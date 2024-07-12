import * as path from 'path';

export default {
  release: '20240415',
  appName: 'Boilerplate API',
  debug: true,
  jwt: {
    token: {
      secret: 'lX%($kwY',
      expiresIn: '60m',
    },
    refreshToken: {
      secret: 'lX%($kwY$!hzG8P3t',
      expiresIn: '7d',
    },
  },
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  apiPort: 4000,
  database: {
    type: 'postgres',
    host: null,
    port: null,
    synchronize: false,
    logging: 'all',
    logger: 'advanced-console',
    maxQueryExecutionTime: 1000,
    entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    subscribers: [path.join(__dirname, '..', 'subscriber', '*{.ts,.js}')],
    migrations: [path.join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  },
};
