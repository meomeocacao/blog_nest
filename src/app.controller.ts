import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './auth/decorators/allowany.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './users/dtos/user.dto';

@Controller()
// @UseGuards(LocalAuthGuard, RolesGuard)
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // POST /login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@CurrentUser() user: User): any {
    return this.authService.login(user);
  }

  //  GET /profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // POST /register
  @Post('register')
  async register(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<User | undefined> {
    return await this.authService.register(createUserDTO);
  }
}
