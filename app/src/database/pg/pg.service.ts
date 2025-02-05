import { Injectable, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import PgConfig from 'src/config/pg.config';
import { sql } from 'drizzle-orm';
import { InjectConfig } from 'src/config/config.decorators';
import { seed } from 'drizzle-seed';
import { users } from './schema/users';
import { userConsents } from './schema/user-consents';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

@Injectable()
export class PgService {
  private readonly logger = new Logger(PgService.name);

  private readonly APPLICATION_DATABASE = 'app_db';

  private readonly pool = new Pool({
    connectionString: this.pgConfig.pgConnectionString,
    database: this.APPLICATION_DATABASE,
  });

  private readonly db = drizzle({ client: this.pool });

  constructor(@InjectConfig(PgConfig) private readonly pgConfig: PgConfig) {}

  async #seedData() {
    try {
      this.logger.debug('seeding');
      await this.db.execute(sql`
        DROP table IF EXISTS user_consents;
        DROP table IF EXISTS users;
      `);
      await migrate(this.db, {
        migrationsFolder: 'src/database/pg/migrations',
      });
      this.logger.debug('migrated');

      await seed(this.db, { users, userConsents });
    } catch (error) {
      throw new Error(`seedData error: ${error}`);
    }
  }

  async shouldSeedData() {
    try {
      const queryResult = await this.db.execute<{ exists: boolean }>(
        sql`SELECT EXISTS (
              SELECT 1
              FROM pg_database
              WHERE datname = ${this.APPLICATION_DATABASE}
            ) AS exists;`,
      );

      const doesAppDbExist = queryResult.rows[0].exists;

      if (!doesAppDbExist) {
        await this.#seedData();
      }
    } catch (error) {
      this.logger.error(`shouldSeedData Error: ${JSON.stringify(error)}`);
    }
  }
}
