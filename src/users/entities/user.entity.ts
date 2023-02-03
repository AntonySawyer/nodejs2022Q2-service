import { Exclude, Expose } from 'class-transformer';

import { IUser } from './user.interface';

export class UserEntity implements IUser {
  constructor() {
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  @Exclude({ toPlainOnly: true })
  password: string;

  version: number;
  createdAt: number;
  updatedAt: number;
}
