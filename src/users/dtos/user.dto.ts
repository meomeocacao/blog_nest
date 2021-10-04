import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { PrimaryColumn } from 'typeorm';

export class CreateUserDTO {
  @PrimaryColumn()
  @IsNotEmpty()
  @Length(4, 20)
  @ApiProperty()
  username: string;

  @IsEmail()
  @PrimaryColumn()
  @ApiProperty()
  email: string;
  @Length(8, 12)
  @IsNotEmpty()
  //   @Matches(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  //   {
  //       message: `Password is to weak`,
  //   })
  //   Passwords will contain at least 1 upper case letter
  // Passwords will contain at least 1 lower case letter
  // Passwords will contain at least 1 number or special character
  // Passwords will contain at least 8 characters in length
  // Password maximum length should not be arbitrarily limited
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @ApiProperty()
  firstname: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'The age of a cat', minimum: 1, default: 1 })
  lastname: string;
  @ApiProperty()
  profile: string;
  @ApiProperty({ name: 'role', enum: Role })
  role: Role;
}
export class UpdateUserDTO {
  @IsEmail()
  @ApiProperty({
    description: 'email, just one email for an account',
    default: 'email',
  })
  email?: string;
  @Length(8, 12)
  @ApiProperty({
    description: 'password of account',
    default: 'password',
  })
  //   @Matches(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  //   {
  //       message: `Password is to weak`,
  //   })
  //   Passwords will contain at least 1 upper case letter
  // Passwords will contain at least 1 lower case letter
  // Passwords will contain at least 1 number or special character
  // Passwords will contain at least 8 characters in length
  // Password maximum length should not be arbitrarily limited
  password?: string;
  @ApiProperty({
    description: 'firstname of account',
    default: 'Firstname',
  })
  firstname?: string;
  @ApiProperty({
    description: 'lastname of account',
    default: 'Lastname',
  })
  lastname?: string;
  @ApiProperty({
    description: 'profile of account',
    default: `Profile of account `,
  })
  profile?: string;
}

export class UserFilterDTO {
  @ApiProperty({
    description: 'firstname to filter',
    default: 'Firstname',
  })
  firstname?: string;
  @ApiProperty({
    description: 'lastname to filter',
    default: 'Lastname',
  })
  lastname?: string;
}

export class UserResponseDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  profile: string;
}
