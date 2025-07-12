import { CreateUserDto } from '@/dtos/users.dto';
import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  list(): Promise<User[]> {
    return this.usersRepository.find();
  }

  get(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  getByUsername(username: string, withPassword = false): Promise<User | null> {
    const select: FindOneOptions<User>['select'] = withPassword
      ? ['id', 'username', 'password']
      : ['id', 'username'];

    return this.usersRepository.findOne({
      where: { username },
      select,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
