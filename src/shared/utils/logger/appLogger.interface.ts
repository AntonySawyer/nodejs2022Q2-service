import { Request, Response } from 'express';

export enum AppLoggerHTTPMessageType {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
}

export type LoggingHTTPServiceParams = {
  type: AppLoggerHTTPMessageType;
  payload: Request | Response;
} & (
  | {
      type: AppLoggerHTTPMessageType.REQUEST;
      payload: Request;
    }
  | {
      type: AppLoggerHTTPMessageType.RESPONSE;
      payload: Response;
      time: number;
      body: Record<string, unknown> | unknown[];
    }
  | {
      type: AppLoggerHTTPMessageType.ERROR;
      time: number;
      payload: Record<string, unknown> | unknown[];
    }
);
