import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dtos/user.dto';
import { User } from 'src/entities/user.entity';

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
    };
  }

  register(userDto: CreateUserDTO): Promise<User | undefined> {
    return this.userService.createUser(userDto);
  }
}
