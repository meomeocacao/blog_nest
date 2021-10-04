import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthCredentialDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'username of account', default: 'username' })
  username: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'password of account', default: 'password' })
  password: string;
}
