import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserRepository } from './user.repository';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserFilterDTO,
} from './userDto/user.DTO';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  //   get user by filter
  // async getUser(userFilterDto: UserFilterDTO): Promise<User[]> {
  //   return await this.userRepository.getUser(userFilterDto);
  // }
  async getUser(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isDelete: false },
      relations: ['posts'],
      withDeleted: false,
    });
  }
  //   get User by Id
  async getUserById(id: string): Promise<User> {
    const found = await this.userRepository.findOne({
      select: ['password'],
      where: {
        id: id,
      },
      relations: ['posts'],
    });
    if (!found) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return found;
  }
  //   get User by any
  async getUserByAny(value: string): Promise<User> {
    const found = await this.userRepository.findOne({
      where: [{ id: value }, { username: value }, { email: value }],
      relations: ['posts'],
      withDeleted: true,
    });
    if (!found) {
      throw new NotFoundException(`User with ${value} not found`);
    }
    return found;
  }

  //   create user
  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const found = await this.userRepository.findOne({
      where: [
        {
          username: createUserDto.username,
        },
        { email: createUserDto.email },
      ],
    });
    if (found) {
      throw new ConflictException(
        `Account username ${found.username} with email ${found.email} existed!`,
      );
    }
    // hash
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    return await this.userRepository.createUser(createUserDto);
  }

  //   update user by Id
  async updateUser(id: string, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // hash
    const salt = await bcrypt.genSalt();
    const { email, password, firstname, lastname, profile } = updateUserDto;
    user.email = email || user.email;
    user.password = (await bcrypt.hash(password, salt)) || user.password;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.profile = profile || user.profile;
    await this.userRepository.save(user);
    return user;
  }
}
