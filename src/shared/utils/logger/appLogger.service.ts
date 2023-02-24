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

  error(message: Error | string) {
    this.logLine(message as string);
    this.errorLogFileWorker.addToFile(`${message}\n`);
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

  private logLine(message: string): void {
    this.fileWorker.addToFile(message);
  }

  private logEndOfBlock() {
    this.logLine('\n');
  }
}
