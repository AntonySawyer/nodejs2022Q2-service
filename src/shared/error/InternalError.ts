import { AppError } from './AppError';

export class InternalError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'InternalError';
  }
}
