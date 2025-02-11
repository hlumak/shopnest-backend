import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async getById(storeId: string, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId,
        userId
      }
    });

    if (!store)
      throw new NotFoundException('Store not found or you are not the owner');

    return store;
  }

  async create(userId: string, dto: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        title: dto.title,
        userId
      }
    });
  }

  async update(storeId: string, userId: string, dto: UpdateStoreDto) {
    await this.getById(storeId, userId);

    return this.prisma.store.update({
      where: { id: storeId },
      data: {
        ...dto,
        userId
      }
    });
  }

  async delete(storeId: string, userId: string) {
    await this.getById(storeId, userId);

    return this.prisma.store.delete({
      where: { id: storeId }
    });
  }
}
