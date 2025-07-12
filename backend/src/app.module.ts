import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import getCommonConfig from './configs/common';
import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { S3Controller } from './controllers/s3/s3.controller';
import { UsersController } from './controllers/users/users.controller';
import { User } from './entities/user.entity';
import { AppService } from './services/app/app.service';
import { AuthService } from './services/auth/auth.service';
import { S3Service } from './services/s3/s3.service';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [getCommonConfig] }),
    JwtModule.register({
      global: true,
      secret: 'secretkey', // TODO
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('db.driver'),
          url: configService.get('db.url'),

          synchronize: configService.get('isDev'),

          entities: [User],
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, S3Controller, AuthController, UsersController],
  providers: [AppService, S3Service, UsersService, AuthService],
})
export class AppModule {}
