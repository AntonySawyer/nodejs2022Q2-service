import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IUser } from './user.interface';

@Entity()
export class UserEntity implements IUser {
  constructor() {
    this.version = 1;
  }

  @PrimaryColumn({ generated: 'uuid' })
  @Expose()
  id: string;

  @Column()
  @Expose()
  login: string;

  @Column()
  @Expose()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column('int')
  version: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'NOW()',
    transformer: {
      from(value: string): number {
        return new Date(value).getTime();
      },
      to(value: string): string {
        return value;
      },
    },
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'NOW()',
    onUpdate: 'NOW()',
    transformer: {
      from(value: string): number {
        return new Date(value).getTime();
      },
      to(value: string): string {
        return value;
      },
    },
  })
  updatedAt: number;
}
