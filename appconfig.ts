import 'dotenv/config';

export const config = {
  database: {
    url: process.env.DATABASE_URL,
    client: process.env.DATABASE_CLIENT,
    migrations_path: process.env.DATABASE_MIGRATIONS_PATH
  }
};