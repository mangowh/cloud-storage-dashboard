import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'Bonusx',
  });
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    logger,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('File Uploader API')
    .setVersion('0.1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    })
    .addSecurityRequirements('bearer')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
  });
  logger.log(`Swagger is running on: http://localhost:${port}/swagger`);

  await app.listen(port, () => {
    logger.log(
      `🚀 Bonusx File Uploader is running on: http://localhost:${port}`,
    );
  });
}

void bootstrap();
