import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO, UserFilterDTO } from './dtos/user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CategoryDTO } from 'src/posts/dtos/category.dtos/category.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private userService: UserService) {}

  // GET /user
  @Get()
  @ApiOkResponse({ description: 'List user with filter' })
  getUserByFilter(@Query() filterDto: UserFilterDTO): Promise<User[]> {
    return this.userService.getUserByFilter(filterDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List all Users' })
  getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  // GET /user/:id
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
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

  // add Category
  @Post('category')
  @Roles(Role.ADMIN)
  async addCategory(@Body() newCate: CategoryDTO): Promise<Category> {
    return this.userService.addCategory(newCate);
  }
}
