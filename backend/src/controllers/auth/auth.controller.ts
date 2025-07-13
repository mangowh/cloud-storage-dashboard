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
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in a user',
    operationId: 'signIn',
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing or invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error during login',
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    operationId: 'getProfile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProfileDto,
    description: 'Current user profile',
  })
  getProfile(@User() user: JwtPayload): ProfileDto {
    return user;
  }
}
