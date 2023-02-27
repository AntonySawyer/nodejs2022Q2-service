import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppLoggerHTTPMessageType } from './appLogger.interface';
import { LoggingService } from './appLogger.service';

@Injectable()
export class AppLoggerInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {
    this.loggingService.setContext(AppLoggerInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.loggingService.logHttp({
      payload: context.switchToHttp().getRequest(),
      type: AppLoggerHTTPMessageType.REQUEST,
    });

    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        this.loggingService.logHttp({
          payload: context.switchToHttp().getResponse(),
          type: AppLoggerHTTPMessageType.RESPONSE,
          time: Date.now() - now,
          body: data,
        });
      }),
      catchError((error) => {
        this.loggingService.logHttp({
          payload: error,
          type: AppLoggerHTTPMessageType.ERROR,
          time: Date.now() - now,
        });

        return throwError(() => error);
      }),
    );
  }
}
