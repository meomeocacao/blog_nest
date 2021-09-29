import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { jwtConstants } from './strategies/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      // refresh_token: this.jwtService.sign(payload, {
      //   secret: jwtConstants.refreshSecret,
      //   expiresIn: jwtConstants.accessExpires,
      // }),
    };
  }

  register(userDto: CreateUserDTO): Promise<User | undefined> {
    return this.userService.createUser(userDto);
  }
  // async getCookieWithJwtRefreshToken(user: any) {
  //   const _user = await this.userService.getUserByUsername(user.username);
  //   const payload = { _user };
  //   const token = this.jwtService.sign(payload, {
  //     secret: jwtConstants.refreshSecret,
  //     expiresIn: jwtConstants.refreshExpires,
  //   });

  //   return {
  //     refresh_token: token,
  //   };
  // }

  addRefreshToken(userId: string, refrehsToken: string) {
    this.userService.addRefreshToken(userId, refrehsToken);
  }

  removeRefreshToken(userId: string) {
    this.userService.removeRefreshToken(userId);
  }
}
