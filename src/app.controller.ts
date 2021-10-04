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
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './auth/decorators/allowany.decorator';
import { AuthCredentialDTO } from './auth/dtos/auth.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './users/dtos/user.dto';
import { UserService } from './users/user.service';

@Controller()
@ApiBearerAuth('access-token')
@UseInterceptors(ClassSerializerInterceptor)
// @UseGuards(LocalAuthGuard, RolesGuard)
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // POST /login
  @UseGuards(LocalAuthGuard)
  // @ApiBearerAuth()
  @Post('login')
  @ApiBody({ type: AuthCredentialDTO })
  // async login(@CurrentUser() user: User) {
  //   const token = await this.authService.login(user);
  //   // this.authService.addRefreshToken(user.id, token.refresh_token);
  //   return token;
  // }
  @ApiConsumes('application/x-www-form-urlencoded')
  async login(@Body() userAuthDto: AuthCredentialDTO) {
    const user = await this.authService.validateUser(
      userAuthDto.username,
      userAuthDto.password,
    );
    const token = await this.authService.login(user);
    return token;
  }
  //  GET /profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    console.log(user);

    return user;
  }

  // POST /register
  async register(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<User | undefined> {
    return await this.authService.register(createUserDTO);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // async logOut(@CurrentUser() user: User) {
  //   await this.authService.removeRefreshToken(user.id);
  //   return `Logged Out`;
  // }
}
