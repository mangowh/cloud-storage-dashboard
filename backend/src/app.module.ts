import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import getCommonConfig from './configs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app/app.service';
import { S3Controller } from './controllers/s3/s3.controller';
import { S3Service } from './services/s3/s3.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [getCommonConfig] })],
  controllers: [AppController, S3Controller],
  providers: [AppService, S3Service],
})
export class AppModule {}
