import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User } from './entities';

export enum USER_SERVICE_ERROR {
  NOT_FOUND = 'USER_NOT_FOUND',
  EXIST = 'USER_EXIST'
}

export class UserServiceError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async isUserExist(data) {
    await this.isEmailExist(data)
    await this.isUsernameExist(data)
  }

  private async isEmailExist(data) {
    const [_, countEmail] = await this.userRepository.findAndCount({
      where: { email: data.email }
    });

    if (countEmail > 0) {
      throw new UserServiceError(USER_SERVICE_ERROR.EXIST, 'Email already exist.');
    }
  }

  private async isUsernameExist(data) {
    const [__, countUsername] = await this.userRepository.findAndCount({
      where: { username: data.username }
    });

    if (countUsername > 0) {
      throw new UserServiceError(USER_SERVICE_ERROR.EXIST, 'Username already exist.');
    }
  }

  async create(data) {
    await this.isUserExist(data);
    return await this.userRepository.insert(data);
  }

  async update(data, where) {
    const currentData =  await getConnection()
      .createQueryBuilder()
      .select("*")
      .from(User, 'user')
      .where("username = :username OR email = :email OR id = :id", {
        username: where.selector,
        email: where.selector,
        id: where.selector
      })
      .execute();

    return await getConnection()
      .createQueryBuilder()
      .update(User)
      .set(data)
      .where("username = :username OR email = :email OR id = :id", {
        username: where.selector,
        email: where.selector,
        id: where.selector
      })
      .execute();
  }

  async delete(where) {
    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("username = :username OR email = :email OR id = :id", {
        username: where.selector,
        email: where.selector,
        id: where.selector
      })
      .execute();
    if (result.affected === 0) {
      throw new UserServiceError(USER_SERVICE_ERROR.NOT_FOUND, 'User not deleted. Maybe it does not exist?');
    }
    return result;
  }

  async getOne(where?) {

    let query = getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user");

    if (where) {
      query = query.where("username = :username OR email = :email OR id = :id", {
        username: where.selector,
        email: where.selector,
        id: where.selector
      })
    }

    return await query.getOne();
  }

  async get(where?, page?, itemPerPage = 2) {
    let query = getConnection()
      .createQueryBuilder()
      .select("user")
      .from(User, "user");

    if (where) {
      query = query.where("username = :username OR email = :email OR id = :id", {
        username: where.selector,
        email: where.selector,
        id: where.selector
      })
    }

    const count = await query.getCount();

    if (page) {
      const offset = (page - 1) * itemPerPage;
      query = query.offset(offset).limit(itemPerPage);
    }

    return {
      results: await query.getMany(),
      totalPage: Math.ceil(count / itemPerPage)
    }
  }
}
