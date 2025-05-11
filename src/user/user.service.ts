import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        stores: true,
        favorites: {
          include: {
            product: {
              include: {
                category: true,
                color: true,
                reviews: true
              }
            }
          }
        },
        orders: true
      }
    });

    return this.transformFavorites(user);
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        stores: true,
        favorites: {
          include: {
            product: true
          }
        },
        orders: true
      }
    });

    return this.transformFavorites(user);
  }

  async toggleFavorite(productId: string, userId: string) {
    const favorite = await this.prisma.userFavorite.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (favorite) {
      await this.prisma.userFavorite.delete({
        where: {
          userId_productId: { userId, productId }
        }
      });
    } else {
      await this.prisma.userFavorite.create({
        data: {
          userId,
          productId
        }
      });
    }

    return true;
  }

  async create(dto: AuthDto) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password)
      }
    });
  }

  private transformFavorites(user: any) {
    if (user) {
      const favoriteProducts = user.favorites.map(favorite => favorite.product);
      return { ...user, favorites: favoriteProducts };
    }
    return user;
  }
}
