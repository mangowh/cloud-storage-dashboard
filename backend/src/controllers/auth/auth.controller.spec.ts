import { AuthService } from '@/services/auth/auth.service';
import { Mocked, TestBed } from '@suites/unit';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Mocked<AuthService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthController).compile();
    authController = unit;
    authService = unitRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('service should be defined', () => {
    expect(authService).toBeDefined();
  });
});
