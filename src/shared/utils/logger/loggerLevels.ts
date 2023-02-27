import { LogLevel } from '@nestjs/common';

export const LOGGER_LEVEL_MAP: { [key: number]: LogLevel[] } = {
  0: ['error', 'warn'],
  1: ['error', 'warn', 'verbose', 'debug'],
  2: ['error', 'warn', 'verbose', 'debug', 'log'],
};
