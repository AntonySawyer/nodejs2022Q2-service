import { EntityWithId } from 'src/shared/db/db.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { FAV_TYPE, IFavEntity } from './fav.interface';

@Entity()
export class FavEntity implements IFavEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: FAV_TYPE,
  })
  type: FAV_TYPE;

  @PrimaryColumn('uuid', {
    nullable: false,
  })
  entityId: EntityWithId['id'];
}
