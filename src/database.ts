import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: env.DATABASE_MIGRATIONS_PATH,
  }
};
export const knex = setupKnex(config);