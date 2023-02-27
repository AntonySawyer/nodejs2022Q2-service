import { EntityWithId } from 'src/shared/db/db.interface';
import { IUser } from 'src/users/entities/user.interface';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignUpResponse extends EntityWithId {
  message: string;
}

export interface TokenEntityInterface {
  id: IUser['id'];
  accessToken: string;
  refreshToken: string;
  createdAt: number;
}

export interface RefreshTokenRequest {
  refreshToken: TokenEntityInterface['refreshToken'];
}

export interface RefreshTokenDecoded {
  id: string;
  exp: number;
}
