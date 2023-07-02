import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed.service';
import { SeedModule } from './seed.module';
const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(SeedService).run();

  await app.close();
};

void runSeed();
