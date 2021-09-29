import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDTO, UpdateUserDTO, UserFilterDTO } from './dtos/user.dto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { hashPass } from 'src/auth/strategies/constants';
import { CategoryDTO } from 'src/posts/dtos/category.dtos/category.dto';
import { RefreshToken } from 'src/refresh-tokens/entities/refresh-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(Category)
    private readonly cateRepository: Repository<Category>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
  ) {}

  //   get user by filter
  async getUserByFilter(userFilterDto: UserFilterDTO): Promise<User[]> {
    return await this.userRepository.getUserByFilter(userFilterDto);
  }
  getAllUser(): Promise<User[]> {
    return this.userRepository.getAllUser();
  }
  //   get User by Id
  async getUserById(id: string): Promise<User> {
    return this.userRepository.checkUserByQuery(id);
  }

  //   create user
  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const checkUser = await this.userRepository.checkUserByQuery(
      createUserDto.username,
    );
    const checkEmail = await this.userRepository.checkUserByQuery(
      createUserDto.email,
    );
    if (checkUser) throw new ConflictException(`Username is used`);
    if (checkEmail) throw new ConflictException(`Email is used`);
    // hash
    createUserDto.password = await hashPass(createUserDto.password);
    return await this.userRepository.save(createUserDto);
  }

  //   update user by Id
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDTO,
  ): Promise<User | undefined> {
    const user = await this.userRepository.checkUserByQuery(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const checkEmail = await this.userRepository.checkUsersByQuery(
      updateUserDto.email,
    );

    if (checkEmail.length >= 1 && updateUserDto.email != user.email)
      throw new ConflictException(`Email ${updateUserDto.email} is used`);

    // hash
    if (updateUserDto.password) {
      updateUserDto.password = await hashPass(updateUserDto.password);
    }

    await this.userRepository.update({ id: user.id }, updateUserDto);
    return await this.userRepository.checkUserByQuery(id);
  }

  //  add category to db
  async addCategory(newCate: CategoryDTO): Promise<Category> {
    console.log(newCate);

    const found = await this.cateRepository.findOne({
      where: {
        title: newCate.title,
      },
    });
    if (found)
      throw new ConflictException(`Category with ${newCate.title} existed!`);
    return await this.cateRepository.save(newCate);
  }

  // get user by username
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .getOne();
  }

  // set current refresh token
  // async setCurrentRefreshToken(_refreshToken: string, userId: number) {
  //   const hashedRefreshToken = await hashPass(_refreshToken);
  //   await this.userRepository.update(userId, {
  //     refreshToken: hashedRefreshToken,
  //   });
  // }
  //  add Refresh token to user
  async addRefreshToken(id: string, _refreshToken: string) {
    const hashedRefreshToken = await hashPass(_refreshToken);
    this.userRepository.update(id, { refreshToken: hashedRefreshToken });
  }
}
