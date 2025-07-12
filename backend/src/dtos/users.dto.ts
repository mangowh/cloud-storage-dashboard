import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane Doe' })
  @Expose()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'janedoe' })
  @Expose()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Str0ngP@ss!',
    description: 'At least 6 characters',
  })
  @Expose()
  @MinLength(6)
  password: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 'a3f1b2c4-5d6e-7f8a-9b0c-d1e2f3a4b5c6' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'janedoe' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'Jane Doe' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'user', description: 'User role' })
  @Expose()
  role: string;

  @ApiProperty({ example: '2025-07-13T00:59:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2025-07-13T00:59:00.000Z' })
  @Expose()
  updatedAt: Date;
}

export class ProfileDto {
  @ApiProperty({ example: 'a3f1b2c4-5d6e-7f8a-9b0c-d1e2f3a4b5c6' })
  @Expose()
  sub: string;

  @ApiProperty({ example: 1626200000, description: 'Issued at (epoch)' })
  @Expose()
  iat: number;

  @ApiProperty({ example: 1626203600, description: 'Expiry (epoch)' })
  @Expose()
  exp: number;

  @ApiProperty({ example: 'janedoe', required: false })
  @Expose()
  username?: string;

  @ApiProperty({ example: 'jane.doe@example.com', required: false })
  @Expose()
  email?: string;

  @ApiProperty({ example: 'user', required: false })
  @Expose()
  role?: string;
}
