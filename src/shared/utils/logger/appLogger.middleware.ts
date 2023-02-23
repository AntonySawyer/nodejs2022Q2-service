import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerHTTPMessageType } from './appLogger.interface';
import { LoggingService } from './appLogger.service';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(private loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.loggingService.setContext(AppLoggerMiddleware.name);

    this.loggingService.logHttp({
      type: AppLoggerHTTPMessageType.REQUEST,
      payload: req,
    });

    this.loggingService.logHttp({
      type: AppLoggerHTTPMessageType.RESPONSE,
      payload: res,
    });

    next();
  }
}
