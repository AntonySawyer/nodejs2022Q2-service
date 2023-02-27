import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = 'ValidationError';
  }
}
