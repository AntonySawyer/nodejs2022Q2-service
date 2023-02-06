import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError';

export class UnprocessableError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    this.name = 'UnprocessableError';
  }
}
