import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError, InternalError } from '../error';
import { LoggingService } from '../utils/logger/appLogger.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,

    private loggingService: LoggingService,
  ) {
    process.on('uncaughtException', (error: Error) => {
      this.catch(error, this.httpAdapterHost as unknown as ArgumentsHost);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      this.catch(
        new InternalError(`${reason}`),
        this.httpAdapterHost as unknown as ArgumentsHost,
      );
    });
  }

  catch(exception: Error | string, host: ArgumentsHost) {
    const isKnownError = exception instanceof AppError;

    if (isKnownError) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });

      return;
    }

    this.loggingService.error(exception);

    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json('Something went wrong.');

      return;
    } else {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();

      const responseBody = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        exception,
      };

      httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
