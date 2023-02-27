import { ValidationPipe, LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { BadRequestError } from './shared/error';
import { AuthGuard } from './shared/guards/auth.guard';
import { DEFAULT_APP_PORT } from './shared/server/defaultPort';
import { setupSwagger } from './shared/server/setupSwagger';
import { AppLoggerInterceptor } from './shared/utils/logger/appLogger.interceptor';
import { LoggingService } from './shared/utils/logger/appLogger.service';
import { LOGGER_LEVEL_MAP } from './shared/utils/logger/loggerLevels';

dotenv.config();

const { PORT } = process.env;

async function bootstrap() {
  const { LOG_LEVEL } = process.env;
  const DEFAULT_LOG_LEVEL = 2;
  const loggerLevels: LogLevel[] =
    LOGGER_LEVEL_MAP[LOG_LEVEL ?? DEFAULT_LOG_LEVEL];

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: loggerLevels ?? ['error'],
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

  app.useGlobalInterceptors(
    new AppLoggerInterceptor(
      new LoggingService('app', {
        logLevels: loggerLevels,
      }),
    ),
  );

  app.useGlobalGuards(new AuthGuard());

  await app.listen(PORT || DEFAULT_APP_PORT);
}

bootstrap();
