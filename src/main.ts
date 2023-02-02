import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { DEFAULT_APP_PORT } from './shared/server/defaultPort';
import { setupSwagger } from './shared/server/setupSwagger';

dotenv.config();

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  await app.listen(PORT || DEFAULT_APP_PORT);
}

bootstrap();
