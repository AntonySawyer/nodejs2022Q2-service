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
        const { body } = data;

        this.log('New Response send');
        this.log(`Status code: ${response.statusCode}`);

        if (process.env.LOG_FULL_RESPONSE_BODY) {
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

        this.log('Response finished with error');
        this.log(`Status code: ${error.getStatus()}`);

        this.log(`Message: ${error.message}`);

        this.log(`Finished in ${data.time}ms`);
        this.logEndOfBlock();

        break;

      default:
        break;
    }
  }

  log(message: any, ...optionalParams: any[]) {
    this.logLine(`${this.getTimestamp()} - ${this.context} - ${message}`);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logLine('error');
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logLine('warn');
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logLine('debug');
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logLine('verbose');
  }

  private logLine(message: string): void {
    console.log(message);
  }

  private logEndOfBlock() {
    this.logLine('\n');
  }
}
