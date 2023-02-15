import { Injectable } from '@nestjs/common';
import { IGenericRepository } from 'src/shared/db/db.interface';
import { GenericRepository } from 'src/shared/db/genericRepository';
import { v4 as uuidV4 } from 'uuid';
import { instanceToPlain, plainToClass } from 'class-transformer';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { IUserResponse } from './entities/user.interface';
import { AuthError } from 'src/shared/error/AuthError';
import { validateIsUUID } from 'src/shared/utils/validateIsUUID';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {
    this.storage = new GenericRepository<UserEntity>(this.repository);
  }

  private storage: IGenericRepository<UserEntity>;

  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const newId = uuidV4();
    const userInstance = plainToClass(UserEntity, {
      id: newId,
      ...createUserDto,
    });

    const createdUserInstance = await this.storage.create(userInstance);

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
      await validateIsUUID(id);

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
      await validateIsUUID(id);

      const originalUser = await this.storage.findById(id);

      const updatedUserInstance = plainToClass(UpdateUserDto, updateUserDto);

      if (originalUser.password !== updatedUserInstance.oldPassword) {
        throw new AuthError('Incorrect password');
      }

      const userForUpdate: Partial<UserEntity> = {
        password: updatedUserInstance.newPassword,
        version: originalUser.version + 1,
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
      await validateIsUUID(id);

      await this.storage.removeById(id);
    } catch (error) {
      throw error;
    }
  }
}
