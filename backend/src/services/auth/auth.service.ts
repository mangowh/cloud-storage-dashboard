import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const userWithPassword = await this.usersService.getByUsername(
      username,
      true,
    );

    if (!userWithPassword) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await compare(password, userWithPassword.password);
    if (!isMatch) {
      throw new UnauthorizedException("Password doesn't match");
    }

    const user = await this.usersService.get(userWithPassword.id);

    const payload = {
      sub: userWithPassword.id,
      username: userWithPassword.username,
      email: userWithPassword.email,
      role: userWithPassword.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { user, accessToken };
  }
}
