import { StatusCodes } from 'http-status-codes';

import { AppError } from './AppError';

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = 'AuthError';
  }
}
