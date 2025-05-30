import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductDto } from './dto/product.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchTermFilter(searchTerm);

    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    });
  }

  private async getSearchTermFilter(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      include: {
        category: true,
        color: true,
        reviews: true
      }
    });
  }

  async getManyByStoreId(storeId: string) {
    return this.prisma.product.findMany({
      where: {
        storeId
      },
      include: {
        category: true,
        color: true
      }
    });
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        color: true,
        reviews: {
          include: {
            user: true
          }
        }
      }
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getManyByCategory(categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          id: categoryId
        }
      },
      include: {
        category: true,
        color: true,
        reviews: true
      }
    });

    if (!products) throw new NotFoundException('Product not found');

    return products;
  }

  async getMostPopular() {
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    const productIds = mostPopularProducts.map(item => item.productId);

    return this.prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      include: {
        category: true
      }
    });
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (!currentProduct)
      throw new NotFoundException('Current product not found');

    return this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct.category?.title
        },
        NOT: {
          id: currentProduct.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    });
  }

  async create(storeId: string, dto: ProductDto) {
    const data: {
      title: string;
      description: string;
      price: Decimal;
      images: string[];
      storeId: string;
      categoryId?: string;
      colorId?: string;
    } = {
      title: dto.title,
      description: dto.description,
      price: new Decimal(dto.price),
      images: dto.images,
      storeId
    };

    // Добавляем categoryId только если он предоставлен
    if (dto.categoryId) {
      data.categoryId = dto.categoryId;
    }

    // Добавляем colorId только если он предоставлен
    if (dto.colorId) {
      data.colorId = dto.colorId;
    }

    return this.prisma.product.create({
      data
    });
  }

  async update(id: string, dto: ProductDto) {
    await this.getById(id);

    const updateData = {
      ...dto,
      price: new Decimal(dto.price)
    };

    return this.prisma.product.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string) {
    await this.getById(id);

    return this.prisma.product.delete({
      where: { id }
    });
  }
}
