import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserFilterDTO,
} from './userDto/user.DTO';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // GET /user
  @Get()
  getUser(@Query() filterDto: UserFilterDTO): Promise<User[]> {
    return this.userService.getUser(filterDto);
  }

  // GET /user/:id
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Get('/find/:any')
  getUserByAny(@Param('any') any: string): Promise<User> {
    return this.userService.getUserByAny(any);
  }
  //   GET /user/:username
  //   POST /user/
  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
  //   PATCH /user/:id
  @Patch('/:id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDTO,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
