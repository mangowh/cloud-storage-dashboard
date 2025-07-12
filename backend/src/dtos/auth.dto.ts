import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { UserResponseDto } from './users.dto';

export class SignInDto {
  @ApiProperty({ example: 'johndoe', description: 'Your unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'Your account password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user data',
  })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...signature',
    description: 'JWT access token',
  })
  accessToken: string;
}
