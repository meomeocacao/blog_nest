import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { PrimaryColumn } from 'typeorm';

export class CreateUserDTO {
  @PrimaryColumn()
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsEmail()
  @PrimaryColumn()
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
  password: string;
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  profile: string;
}
export class UpdateUserDTO {
  @IsEmail()
  email?: string;
  @Length(8, 12)
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
  firstname?: string;
  lastname?: string;
  profile?: string;
}

export class UserFilterDTO {
  firstname?: string;
  lastname?: string;
}
