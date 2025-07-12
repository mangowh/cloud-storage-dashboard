import { IsNotEmpty, IsString } from 'class-validator';
import { IUserResponseDto, UserResponseDto } from './users.dto';

export class ISignInDto {
  username: string;
  password: string;
}

export class SignInDto implements ISignInDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}

export interface ILoginSuccessResponse {
  user: IUserResponseDto;
  accessToken: string;
}

export class LoginResponseDto implements ILoginSuccessResponse {
  user: UserResponseDto;
  accessToken: string;
}
