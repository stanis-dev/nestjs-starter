import { applyDecorators, Inject } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { AppConfiguration } from './config.module';

/**
 * @decorator InjectConfig
 *
 * Property decorator to inject config classes.
 * A simple `@Inject()` wrapper with type safety
 *
 * @example ```ts
 * constructor(@InjectConfig(PgConfig) private readonly pgConfig: PgConfig) {}
 *
 * ```
 *
 * @param config
 * @returns
 */
export const InjectConfig = (config: AppConfiguration) => {
  return Inject(config.name);
};

/**
 * @decorator EnvVar
 *
 * Property decorator that `@Expose()`s an environment variable and assigns the `'env_vars'` group to it.
 *
 * @param {string} name - The name of the environment variable as defined in the environment.
 *
 * @example
 * ```ts
 * class PgConfig {
 *  \@EnvVar('POSTGRES_CONNECTION_STRING')
 *  \@IsString()
 *  \@IsNotEmpty()
 *  pgConnectionString: string; // variable name is decoupled from the env var's name.
 * }
 * ```
 */
export const EnvVar = (name: string): PropertyDecorator =>
  applyDecorators(Expose({ name, groups: ['env_vars'] }));
