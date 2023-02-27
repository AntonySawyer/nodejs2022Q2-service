import { EntityWithId } from 'src/shared/db/db.interface';

export interface LoginResponse {
  accessToken: string;
}

export interface SignUpResponse extends EntityWithId {
  message: string;
}
