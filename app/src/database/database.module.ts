import { Module } from '@nestjs/common';
import { PgService } from './pg/pg.service';

@Module({
  providers: [PgService],
})
export class DatabaseModule {}
