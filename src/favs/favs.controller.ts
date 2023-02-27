import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';

import { FavsService } from './favs.service';
import { EntityType } from './entities/fav.interface';
import { StatusCodes } from 'http-status-codes';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post(':entity/:id')
  create(@Param('entity') entity: EntityType, @Param('id') id: string) {
    switch (entity) {
      case 'album':
        return this.favsService.addAlbum(id);

      case 'artist':
        return this.favsService.addArtist(id);

      case 'track':
        return this.favsService.addTrack(id);

      default:
        break;
    }
  }

  @Delete(':entity/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('entity') entity: EntityType, @Param('id') id: string) {
    switch (entity) {
      case 'album':
        return this.favsService.removeAlbum(id);

      case 'artist':
        return this.favsService.removeArtist(id);

      case 'track':
        return this.favsService.removeTrack(id);

      default:
        break;
    }
  }
}
