import { HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

export class AppError extends HttpException {
  constructor(message: string, status: StatusCodes) {
    super(message, status);
    this.name = 'AppError';
  }
}
