import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @MaxLength(20, { message: 'Password must be maximum 20 characters long' })
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords will contain at least 1 upper case letter, at least 1 lower case letter, at least 1 number or special character',
  })
  password: string;
}
