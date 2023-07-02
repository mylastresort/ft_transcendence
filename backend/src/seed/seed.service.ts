import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private Prisma: PrismaService) {}

  async run() {
    const userData = [
      {
        id_42: 3445,
        username: 'user1',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user1',
        lastName: 'user1',
      },
      {
        id_42: 3446,
        username: 'user2',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user2',
        lastName: 'user2',
      },
      {
        id_42: 3443,
        username: 'user2',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user2',
        lastName: 'user2',
      },
      {
        id_42: 34436,
        username: 'user2',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user2',
        lastName: 'user2',
      },
      {
        id_42: 34446,
        username: 'user2',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user2',
        lastName: 'user2',
      },
      {
        id_42: 35446,
        username: 'user2',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user2',
        lastName: 'user2',
      },
      {
        id_42: 34146,
        username: 'user2',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user2',
        lastName: 'user2',
      },
      {
        id_42: 342246,
        username: 'user2',
        imgProfile:
          'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
        firstName: 'user2',
        lastName: 'user2',
      },
    ];

    userData.forEach(async (user) => {
      try {
        await this.Prisma.user.create({ data: user });
        console.log('User created successfully:', user.username);
      } catch (error) {
        console.error('Error creating user:', user.username, error);
      }
    });
  }
}
