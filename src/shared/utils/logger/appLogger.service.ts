import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import {
  AppLoggerHTTPMessageType,
  LoggingHTTPServiceParams,
} from './appLogger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger implements LoggerService {
  logHttp({ payload, type }: LoggingHTTPServiceParams) {
    switch (type) {
      case AppLoggerHTTPMessageType.REQUEST:
        const request = payload as unknown as Request;

        this.log('Start logging Request');
        this.log(`Url: ${request.url}`);
        this.log(`Method: ${request.method}`);

        if (request?.body && Object.keys(request.body).length !== 0) {
          this.log('Body:');
          this.log(JSON.stringify(request.body));
        } else {
          this.log('Body is empty');
        }

        this.log('End logging Request \n');

        break;

      case AppLoggerHTTPMessageType.RESPONSE:
        this.log('Start logging Response');
        this.log('End logging Response \n');

        break;

      default:
        break;
    }
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(`${this.getTimestamp()} - ${this.context} - ${message}`);
  }

  error(message: any, ...optionalParams: any[]) {
    console.log('error');
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log('warn');
  }

  debug(message: any, ...optionalParams: any[]) {
    console.log('debug');
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log('verbose');
  }
}
