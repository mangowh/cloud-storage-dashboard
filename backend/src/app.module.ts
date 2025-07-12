import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getCommonConfig from './configs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app/app.service';
import { S3Controller } from './controllers/s3/s3.controller';
import { S3Service } from './services/s3/s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [getCommonConfig] }),
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
  controllers: [AppController, S3Controller],
  providers: [AppService, S3Service, UsersService],
})
export class AppModule {}
