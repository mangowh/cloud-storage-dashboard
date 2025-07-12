import { User } from '@/decorators/user.decorator';
import { LoginResponseDto, SignInDto } from '@/dtos/auth.dto';
import { ProfileDto } from '@/dtos/users.dto';
import { AuthGuard, JwtPayload } from '@/guards/auth.guard';
import { AuthService } from '@/services/auth/auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: SignInDto, description: 'User credentials for login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials or authentication failed',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed (e.g., missing username/password)',
  })
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const result = await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      );

      if (!result) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new InternalServerErrorException('Authentication failed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User is logged in and profile is returned',
    type: ProfileDto,
  })
  getProfile(@User() user: JwtPayload): ProfileDto {
    return user;
  }
}
