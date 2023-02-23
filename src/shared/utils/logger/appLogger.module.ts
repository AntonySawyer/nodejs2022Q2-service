import { Module } from '@nestjs/common';
import { LoggingService } from './appLogger.service';

@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class AppLoggerModule {}
