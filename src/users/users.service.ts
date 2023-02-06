import { Injectable } from '@nestjs/common';
import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { v4 as uuidV4 } from 'uuid';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { isUUID } from 'class-validator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { IUserResponse } from './entities/user.interface';
import { BadRequestError } from 'src/shared/error';
import { AuthError } from 'src/shared/error/AuthError';

// TODO: refactor response type using some util or update code to use other Class instance for hide `password` field

@Injectable()
export class UsersService {
  constructor() {
    this.storage = new GenericRepository<UserEntity>();
  }

  private storage: IGenericRepository<UserEntity>;

  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const newId = uuidV4();
    const userInstance = plainToClass(UserEntity, {
      id: newId,
      ...createUserDto,
    });

    const createdUserInstance = await this.storage.create(newId, userInstance);

    const plainCreatedUser = instanceToPlain(
      createdUserInstance,
    ) as IUserResponse;

    return plainCreatedUser;
  }

  async findAll(): Promise<IUserResponse[]> {
    const userInstances = await this.storage.find();

    const plainUsers: IUserResponse[] = userInstances.map(
      (userInstance) => instanceToPlain(userInstance) as IUserResponse,
    );

    return plainUsers;
  }

  async findOne(id: string): Promise<IUserResponse> {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      const user = await this.storage.findById(id);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      const originalUser = await this.storage.findById(id);

      const updatedUserInstance = plainToClass(UpdateUserDto, updateUserDto);

      if (originalUser.password !== updatedUserInstance.oldPassword) {
        throw new AuthError('Incorrect password');
      }

      const userForUpdate: UserEntity = {
        ...originalUser,
        password: updatedUserInstance.newPassword,
        version: originalUser.version + 1,
        updatedAt: Date.now(),
      };

      const updatedUserDbResponse = await this.storage.updateById(
        id,
        userForUpdate,
      );

      delete updatedUserDbResponse.password;

      const plainUpdatedUser = instanceToPlain(
        updatedUserDbResponse,
      ) as IUserResponse;

      return plainUpdatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const isIdValid = isUUID(id, '4');

      if (!isIdValid) {
        throw new BadRequestError('Incorrect format of id');
      }

      await this.storage.removeById(id);
    } catch (error) {
      throw error;
    }
  }
}
