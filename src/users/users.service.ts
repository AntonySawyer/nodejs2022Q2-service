import { Injectable } from '@nestjs/common';
import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor() {
    this.storage = new GenericRepository<User>();
  }

  private storage: IGenericRepository<User>;

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.storage.find();

    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
