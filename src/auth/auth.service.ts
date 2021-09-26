import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password)) == true) {
      const { password, ...rest } = user;
      console.log(user.username);
      
      return rest;
    }

    return null;
  }
  async login(user: any) {
    const payload = { name: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
