import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { HEADER } from '../server/headers';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const { SWAGGER_PATH } = process.env;

    const unsecureRoutes = ['auth/signup', 'auth/login', SWAGGER_PATH, '/'];

    const isSecureRequest = !unsecureRoutes.includes(request.path);

    if (!isSecureRequest) {
      return true;
    }

    const authHeader = request.headers[HEADER.AUTH];

    if (!authHeader) {
      // TODO: throw own error here after implement auth routes
      // return false;
    }

    // TODO: check token valid, etc; after implement auth routes
    return true;
  }
}
