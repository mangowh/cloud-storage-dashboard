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

@Controller('users')
@UseGuards(AuthGuard, AdminGuard)
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto, description: 'User data for creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed or email already exists.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An unexpected error occurred.',
  })
  async create(@Body() newUser: CreateUserDto) {
    const user = await this.userService.create(newUser);

    const dto = Mapper.mapData(UserResponseDto, user);

    return dto;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of users.',
    type: createCollectionDto(UserResponseDto),
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An unexpected error occurred.',
  })
  async list(): Promise<UserResponseDto[]> {
    const users = await this.userService.list();

    const dtos = users.map((obj) => Mapper.mapData(UserResponseDto, obj));

    return dtos;
  }
}
