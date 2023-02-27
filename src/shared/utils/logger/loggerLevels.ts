import { LogLevel } from '@nestjs/common';

export const LOGGER_LEVEL_MAP: { [key: string]: LogLevel[] } = {
  error: ['error'],
  warn: ['error', 'warn'],
  verbose: ['error', 'warn', 'verbose'],
  debug: ['error', 'warn', 'verbose', 'debug'],
  log: ['error', 'warn', 'verbose', 'debug', 'log'],
};
