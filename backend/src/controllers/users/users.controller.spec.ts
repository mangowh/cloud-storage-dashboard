import { CreateUserDto, UserResponseDto } from '@/dtos/users.dto';
import { User } from '@/entities/user.entity';
import { UsersService } from '@/services/users/users.service';
import { Mocked, TestBed } from '@suites/unit';
import { UsersController } from './users.controller';
import { Mapper } from '@/utils/mapper/mapper';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: Mocked<UsersService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersController).compile();
    usersController = unit;
    usersService = unitRef.get(UsersService);
  });

  describe('create', () => {
    it('should call userService.create and return its mapped result', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'John',
        name: 'John Doe',
      };

      const user = Object.assign(new User(), {
        ...createUserDto,
        id: 'u1',
        role: 'user',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
      });

      usersService.create.mockResolvedValue(user);

      const userResponse: UserResponseDto = {
        id: 'u1',
        email: 'test@example.com',
        username: 'John',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
      };

      const mapperSpy = jest
        .spyOn(Mapper, 'mapData')
        .mockReturnValue(userResponse);

      const result = await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mapperSpy).toHaveBeenCalledWith(UserResponseDto, user);
      expect(result).toEqual(userResponse);
    });
  });
});
