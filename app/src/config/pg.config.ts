import { IsNotEmpty, IsString } from 'class-validator';
import { EnvVar } from './config.decorators';

export default class PgConfig {
  @EnvVar('POSTGRES_CONNECTION_STRING')
  @IsString()
  @IsNotEmpty()
  pgConnectionString: string;
}
