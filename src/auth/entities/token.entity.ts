import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

import { TokenEntityInterface } from './auth.interface';

@Entity()
export class TokenEntity implements TokenEntityInterface {
  @PrimaryColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  accessToken: string;

  @Column()
  @Expose()
  refreshToken: string;

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
}
