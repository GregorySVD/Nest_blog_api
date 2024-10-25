import {
  IsEmail,
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message:
      'Username is too short. It should have a minimum length of 5 characters.',
  })
  @MaxLength(25, {
    message:
      'Username is too long. It should have a maximum length of 25 characters.',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message:
      'Password is too short. It should have a minimum length of 8 characters.',
  })
  @MaxLength(100, {
    message:
      'Password is too long. It should have a maximum length of 100 characters.',
  })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password too weak. It should contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}
