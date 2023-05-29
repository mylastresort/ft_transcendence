import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';

config();

const PORT = process.env.APP_PORT || 3000;

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)).setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_DOMAIN,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  });

  const config = new DocumentBuilder()
    .setTitle('Rest APIs')
    .setDescription('The Rest API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('/docs', app, document);

  await app.listen(PORT);
}
bootstrap();
