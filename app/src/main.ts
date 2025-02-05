import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PgService } from './database/pg/pg.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const pgService = app.get(PgService);
  await pgService.shouldSeedData();

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
