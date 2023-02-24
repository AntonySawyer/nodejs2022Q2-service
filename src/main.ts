import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { BadRequestError } from './shared/error';
import { DEFAULT_APP_PORT } from './shared/server/defaultPort';
import { setupSwagger } from './shared/server/setupSwagger';
import { AppLoggerInterceptor } from './shared/utils/logger/appLogger.interceptor';
import { LoggingService } from './shared/utils/logger/appLogger.service';

dotenv.config();

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestError(JSON.stringify(errors)),
    }),
  );

  app.useGlobalInterceptors(new AppLoggerInterceptor(new LoggingService()));

  await app.listen(PORT || DEFAULT_APP_PORT);
}

bootstrap();
