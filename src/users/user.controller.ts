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
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { CategoryDTO } from 'src/posts/dtos/category.dto';
import { UserService } from './user.service';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserFilterDTO,
} from './dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}


  // GET /user
  @Get()
  getUserByFilter(@Query() filterDto: UserFilterDTO): Promise<User[]> {
    return this.userService.getUserByFilter(filterDto);
  }
  
  @Get()
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
  async addCategory(@Body() newCate : CategoryDTO) : Promise<Category>{
    return this.userService.addCategory(newCate);
  }
}
