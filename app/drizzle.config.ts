import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
config();

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/pg/schema/*',
  out: './src/database/pg/migrations',
  casing: 'snake_case',
  dbCredentials: {
    url: 'postgres://postgres:password@localhost:5432',
  },
});
