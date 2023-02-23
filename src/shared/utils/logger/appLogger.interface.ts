import { Request, Response } from 'express';

export enum AppLoggerHTTPMessageType {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
}

export interface LoggingHTTPServiceParams {
  type: AppLoggerHTTPMessageType;
  payload: Request | Response;
}
