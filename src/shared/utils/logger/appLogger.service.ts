import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from 'src/shared/error';
import {
  AppLoggerHTTPMessageType,
  LoggingHTTPServiceParams,
} from './appLogger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger implements LoggerService {
  logHttp(data: LoggingHTTPServiceParams) {
    const { payload, type } = data;

    switch (type) {
      case AppLoggerHTTPMessageType.REQUEST:
        if (!payload) {
          break;
        }

        const request = payload as unknown as Request;

        this.log('New Request accepted');
        this.log(`Method: ${request.method}`);
        this.log(`Url: ${request.url}`);

        if (request?.body && Object.keys(request.body).length !== 0) {
          this.log('Body:');
          this.log(JSON.stringify(request.body));
        } else {
          this.log('Body is empty');
        }

        this.logEndOfBlock();
        break;

      case AppLoggerHTTPMessageType.RESPONSE:
        if (!payload) {
          break;
        }

        const response = payload as Response;
        const shouldLogFullBody = process.env.LOG_FULL_RESPONSE_BODY === 'true';

        this.log('New Response send');
        this.log(`Status code: ${response.statusCode}`);

        if (shouldLogFullBody) {
          const { body } = data;

          if (body && Object.keys(body).length !== 0) {
            this.log('Body:');
            this.log(JSON.stringify(body));
          } else {
            this.log('Body is empty');
          }
        }

        this.log(`Finished in ${data.time}ms`);
        this.logEndOfBlock();

        break;

      case AppLoggerHTTPMessageType.ERROR:
        if (!payload) {
          break;
        }

        const error = payload as unknown as AppError;

        this.error('Request finished with error');

        if (error?.getStatus) {
          this.error(`Status code: ${error?.getStatus()}`);
        }

        this.error(`Message: ${error.message}`);

        this.error(`Finished in ${data.time}ms`);
        this.logEndOfBlock();

        break;

      default:
        break;
    }
  }

  log(message: string) {
    this.logLine(`${this.getTimestamp()} - ${this.context} - ${message}`);
  }

  error(message: Error | string) {
    this.logLine(message);
  }

  warn(message: string) {
    this.logLine('Warning:');
    this.logLine(message);
    this.logEndOfBlock();
  }

  debug(message: string) {
    this.logLine('Debug:');
    this.logLine(message);
    this.logEndOfBlock();
  }

  verbose(message: string) {
    this.logLine('Verbose:');
    this.logLine(message);
    this.logEndOfBlock();
  }

  private logLine(message: string | Error): void {
    console.log(message);
  }

  private logEndOfBlock() {
    this.logLine('\n');
  }
}
