import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dto';
import { UserService, UserServiceError, USER_SERVICE_ERROR } from './user.service';


@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  private handleError(e) {
    if (e instanceof UserServiceError) {
      if (e.name === USER_SERVICE_ERROR.NOT_FOUND) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: e.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e.message,
      }, HttpStatus.BAD_REQUEST);
    }
    
    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Oppsie!',
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @Get(':id')
  async findById(@Param('id') id) {
    let result;
    try {
      result = await this.userService.getOne({ selector: +id });
    } catch (e) {
      return this.handleError(e);
    }

    if (!result) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Get()
  async findMany(@Query('page') page, @Query('itemPerPage') itemPerPage = 2) {
    try {
      return await this.userService.get(undefined, page, itemPerPage);
    } catch (e) {
      return this.handleError(e);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
    } catch (e) {
      return this.handleError(e);
    }
  }

  @Put(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id) {
    try {
      await this.userService.update(updateUserDto, {
        selector: id
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  @Delete(':id')
  async delete(@Body() deleteUserDto: UpdateUserDto, @Param('id') id) {
    try {
      await this.userService.delete({
        selector: id
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  @Delete(':id')
  async deleteBy(@Param('id') id) {
    try {
      await this.userService.delete({
        selector: id
      });
    } catch (e) {
      this.handleError(e);
    }
  }
}
