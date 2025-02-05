/**
 *  @author stan-dev
 */

import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { config as dotenv } from 'dotenv';
dotenv();

import PgConfig from './pg.config';

/** IMPORTANT!: All Configuration Classes Must be Added here! */
const CONFIGURATIONS = [PgConfig] as const;

export type AppConfiguration = (typeof CONFIGURATIONS)[number];

/**
 * Builds FactoryProviders and runs validations.
 * Will fail app bootstrap on validation error
 *
 * @param configClass
 *
 * @throws Error
 */
const createConfigProvider = (
  configClass: AppConfiguration,
): FactoryProvider => ({
  provide: configClass.name,
  useFactory: () => {
    const instance = plainToInstance(configClass, process.env, {
      groups: ['env_vars'],
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });
    const errors = validateSync(instance);
    if (errors.length) {
      throw new Error(`Invalid config: ${errors.toString()}`);
    }

    return instance;
  },
});

/**
 *  Lightweight custom config module. NOT a production ready version. Intended for prototyping/REPL :
 *  - strongly typed and modular configuration
 *  - class-validator validation, which imo is much more readable vs joi
 *  - strongly typed `@Inject` wrapper
 *
 *  Instructions:
 *    1. Create a class with desired property valiations, using `class-validator` decorators. @see `./pg.config.ts`
 *    2. Ensure all prepoerties are decorated with `@EnvVar('ENV_VAR_NAME_HERE')` - @see EnvVar for details
 *    3. Import this module into the root module (e.g. src/app.module.ts )
 *    4. Add all config classes to `CONFIGURATIONS` array
 *    5. Enjoy!
 *
 *  to use config classes @see InjectConfig
 */
@Module({})
export class ConfigModule {
  static forRoot(): DynamicModule {
    const providers = CONFIGURATIONS.map(createConfigProvider);

    return {
      module: ConfigModule,
      global: true,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
