import { createCollectionDto } from '@/dtos/collection.dto';
import { CreateUserDto, UserResponseDto } from '@/dtos/users.dto';
import { AdminGuard } from '@/guards/admin.guard';
import { AuthGuard } from '@/guards/auth.guard';
import { UsersService } from '@/services/users/users.service';
import { Mapper } from '@/utils/mapper/mapper';
import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserResponseDto,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error or duplicate email',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Unexpected error',
  })
  async create(@Body() newUser: CreateUserDto) {
    const user = await this.userService.create(newUser);
    return Mapper.mapData(UserResponseDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: createCollectionDto(UserResponseDto),
    description: 'List of users',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Unexpected error',
  })
  async list(): Promise<UserResponseDto[]> {
    const users = await this.userService.list();
    return users.map((obj) => Mapper.mapData(UserResponseDto, obj));
  }
}
