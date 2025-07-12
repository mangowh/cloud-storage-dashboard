import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export interface ICreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
}

export class CreateUserDto implements ICreateUserDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @MinLength(6)
  password: string;
}

export interface IUserResponseDto {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserResponseDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  role: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
