import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config();

// test prisma
const prisma = new PrismaClient();
async function createUser() {
  const newUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    }
  });
  
  console.log('New user created:', newUser);
}

createUser();

async function getUsers() {
  const users = await prisma.user.findMany();
  console.log('users');
  console.log(users);
}

getUsers();



const PORT  = process.env.SERVER_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
