
import { config as appconfig } from '../appconfig';
import { knex as setupKnex, Knex } from 'knex';

if (!appconfig.database.url) throw new Error('Cannot connect to database');

export const config: Knex.Config = {
  client: appconfig.database.client,
  connection: {
    filename: appconfig.database.url,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: appconfig.database.migrations_path,
  }
};
export const knex = setupKnex(config);