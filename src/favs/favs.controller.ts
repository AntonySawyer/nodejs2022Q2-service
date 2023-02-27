import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';

import { FavsService } from './favs.service';
import { FAV_TYPE } from './entities/fav.interface';
import { StatusCodes } from 'http-status-codes';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post(':entity/:id')
  create(@Param('entity') entity: FAV_TYPE, @Param('id') id: string) {
    return this.favsService.addEntity(entity, id);
  }

  @Delete(':entity/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('entity') entity: FAV_TYPE, @Param('id') id: string) {
    return this.favsService.removeEntity(entity, id);
  }
}
