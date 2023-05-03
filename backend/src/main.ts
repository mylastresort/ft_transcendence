import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {config} from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';



config();

const PORT = process.env.SERVER_PORT || 3000;

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)).setGlobalPrefix('api');
  
  const config = new DocumentBuilder()
  .setTitle('Rest APIs')
  .setDescription('The Rest API description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(PORT);
}
bootstrap();
