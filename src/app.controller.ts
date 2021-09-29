import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './auth/decorators/allowany.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './users/dtos/user.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
// @UseGuards(LocalAuthGuard, RolesGuard)
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // POST /login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User) {
    const token = await this.authService.login(user);
    // this.authService.addRefreshToken(user.id, token.refresh_token);
    return token;
  }

  //  GET /profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // POST /register
  async register(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<User | undefined> {
    return await this.authService.register(createUserDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logOut(@CurrentUser() user: User) {
    await this.authService.removeRefreshToken(user.id);
    return `Logged Out`;
  }
}
