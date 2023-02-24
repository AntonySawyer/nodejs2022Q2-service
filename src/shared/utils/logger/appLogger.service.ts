import {
  ConsoleLogger,
  ConsoleLoggerOptions,
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
import { LogFileWorker, LOG_FILE_DEFAULT } from './logFileWorker';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger implements LoggerService {
  constructor(context?: string, options?: ConsoleLoggerOptions) {
    super(context, options);

    const { LOG_FILE_PREFIX, ERROR_LOG_FILE_PREFIX } = process.env;

    const logFileWorker = new LogFileWorker(
      LOG_FILE_PREFIX ?? LOG_FILE_DEFAULT.FILE_PREFIX,
    );
    logFileWorker.init();

    const errorLogFileWorker = new LogFileWorker(
      ERROR_LOG_FILE_PREFIX ?? LOG_FILE_DEFAULT.ERROR_FILE_PREFIX,
    );
    errorLogFileWorker.init();

    this.fileWorker = logFileWorker;
    this.errorLogFileWorker = errorLogFileWorker;
  }

  private fileWorker: LogFileWorker;

  private errorLogFileWorker: LogFileWorker;

  logHttp(data: LoggingHTTPServiceParams) {
    const { payload, type } = data;

    switch (type) {
      case AppLoggerHTTPMessageType.REQUEST:
        if (!payload) {
          break;
        }

        const request = payload as unknown as Request;

        const requestMessageForLogs = [];

        requestMessageForLogs.push('New Request accepted');
        requestMessageForLogs.push(`Method: ${request.method}`);
        requestMessageForLogs.push(`Url: ${request.url}`);

        if (request?.body && Object.keys(request.body).length !== 0) {
          requestMessageForLogs.push('Body:');
          requestMessageForLogs.push(JSON.stringify(request.body));
        } else {
          requestMessageForLogs.push('Body is empty');
        }

        this.log(requestMessageForLogs.join('\n'));
        break;

      case AppLoggerHTTPMessageType.RESPONSE:
        if (!payload) {
          break;
        }

        const response = payload as Response;
        const shouldLogFullBody = process.env.LOG_FULL_RESPONSE_BODY === 'true';

        const responseMessageForLogs = [];

        responseMessageForLogs.push('New Response send');
        responseMessageForLogs.push(`Status code: ${response.statusCode}`);

        if (shouldLogFullBody) {
          const { body } = data;

          if (body && Object.keys(body).length !== 0) {
            responseMessageForLogs.push('Body:');
            responseMessageForLogs.push(JSON.stringify(body));
          } else {
            responseMessageForLogs.push('Body is empty');
          }
        }

        responseMessageForLogs.push(`Finished in ${data.time}ms`);
        this.log(responseMessageForLogs.join('\n'));

        break;

      case AppLoggerHTTPMessageType.ERROR:
        if (!payload) {
          break;
        }

        const error = payload as unknown as AppError;

        const errorMessageForLogs = [];

        errorMessageForLogs.push('Request finished with error');

        if (error?.getStatus) {
          errorMessageForLogs.push(`Status code: ${error?.getStatus()}`);
        }

        errorMessageForLogs.push(`Message: ${error.message}`);

        errorMessageForLogs.push(`Finished in ${data.time}ms`);

        this.error(errorMessageForLogs.join('\n'));

        break;

      default:
        break;
    }
  }

  log(message: string) {
    this.logLine(`${this.getTimestamp()} - ${this.context} - ${message}`);
  }

  async error(message: Error | string): Promise<void> {
    await this.logLine(message as string);
    await this.errorLogFileWorker.addToFile(message as string);
  }

  warn(message: string) {
    this.logLine('Warning:');
    this.logLine(message);
  }

  debug(message: string) {
    this.logLine('Debug:');
    this.logLine(message);
  }

  verbose(message: string) {
    this.logLine('Verbose:');
    this.logLine(message);
  }

  private async logLine(message: string): Promise<void> {
    await this.fileWorker.addToFile(message);
  }
}
