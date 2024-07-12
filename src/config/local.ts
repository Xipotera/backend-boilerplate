export default {
  debug: false,
  jwt: {
    token: {
      secret: 'lX%($kwY',
      expiresIn: '60s',
    },
  },
  database: {
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: '1684',
    database: 'boilerplate',
    logging: false,
  },
};
