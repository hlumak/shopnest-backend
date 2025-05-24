import { EnumOrderStatus, PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.userFavorite.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.color.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Database cleaned');

    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          password: await argon2.hash('password123'),
          picture: '/uploads/no-user-image.webp'
        }
      }),
      prisma.user.create({
        data: {
          email: 'user@example.com',
          name: 'Regular User',
          password: await argon2.hash('password123'),
          picture: '/uploads/no-user-image.webp'
        }
      }),
      prisma.user.create({
        data: {
          email: 'seller@example.com',
          name: 'Seller Account',
          password: await argon2.hash('password123'),
          picture: '/uploads/no-user-image.webp'
        }
      })
    ]);

    console.log(`Created ${users.length} users`);

    const stores = await Promise.all([
      prisma.store.create({
        data: {
          title: 'Electronics Store',
          description: 'Best electronics and gadgets',
          userId: users[0].id
        }
      }),
      prisma.store.create({
        data: {
          title: 'Fashion Boutique',
          description: 'Latest fashion trends and styles',
          userId: users[2].id
        }
      }),
      prisma.store.create({
        data: {
          title: 'Home Decor',
          description: 'Beautiful items for your home',
          userId: users[2].id
        }
      })
    ]);

    console.log(`Created ${stores.length} stores`);

    const categories = await Promise.all([
      prisma.category.create({
        data: {
          title: 'Smartphones',
          description: 'Latest smartphones and accessories',
          storeId: stores[0].id
        }
      }),
      prisma.category.create({
        data: {
          title: 'Laptops',
          description: 'Powerful laptops for work and gaming',
          storeId: stores[0].id
        }
      }),
      prisma.category.create({
        data: {
          title: 'Accessories',
          description: 'Electronics accessories and peripherals',
          storeId: stores[0].id
        }
      }),
      prisma.category.create({
        data: {
          title: 'Men',
          description: "Men's clothing and accessories",
          storeId: stores[1].id
        }
      }),
      prisma.category.create({
        data: {
          title: 'Women',
          description: "Women's clothing and accessories",
          storeId: stores[1].id
        }
      }),
      prisma.category.create({
        data: {
          title: 'Living Room',
          description: 'Living room decorations and furniture',
          storeId: stores[2].id
        }
      }),
      prisma.category.create({
        data: {
          title: 'Kitchen',
          description: 'Kitchen appliances and decorations',
          storeId: stores[2].id
        }
      })
    ]);

    console.log(`Created ${categories.length} categories`);

    const colors = await Promise.all([
      prisma.color.create({
        data: {
          name: 'Black',
          value: '#000000',
          storeId: stores[0].id
        }
      }),
      prisma.color.create({
        data: {
          name: 'White',
          value: '#FFFFFF',
          storeId: stores[0].id
        }
      }),
      prisma.color.create({
        data: {
          name: 'Silver',
          value: '#C0C0C0',
          storeId: stores[0].id
        }
      }),
      prisma.color.create({
        data: {
          name: 'Red',
          value: '#FF0000',
          storeId: stores[1].id
        }
      }),
      prisma.color.create({
        data: {
          name: 'Blue',
          value: '#0000FF',
          storeId: stores[1].id
        }
      }),
      prisma.color.create({
        data: {
          name: 'Green',
          value: '#00FF00',
          storeId: stores[1].id
        }
      }),
      prisma.color.create({
        data: {
          name: 'Brown',
          value: '#A52A2A',
          storeId: stores[2].id
        }
      }),
      prisma.color.create({
        data: {
          name: 'Beige',
          value: '#F5F5DC',
          storeId: stores[2].id
        }
      })
    ]);

    console.log(`Created ${colors.length} colors`);

    const products = await Promise.all([
      prisma.product.create({
        data: {
          title: 'iPhone 15 Pro',
          description: 'Latest Apple iPhone with powerful features',
          price: 999.99,
          images: ['/uploads/products/iphone.webp'],
          storeId: stores[0].id,
          categoryId: categories[0].id,
          colorId: colors[0].id
        }
      }),
      prisma.product.create({
        data: {
          title: 'Samsung Galaxy S24',
          description: 'Feature-packed Android smartphone',
          price: 899.0,
          images: ['/uploads/products/samsung.webp'],
          storeId: stores[0].id,
          categoryId: categories[0].id,
          colorId: colors[1].id
        }
      }),
      prisma.product.create({
        data: {
          title: 'MacBook Pro M3',
          description: 'Powerful laptop for professionals',
          price: 1499.0,
          images: ['/uploads/products/macbook.webp'],
          storeId: stores[0].id,
          categoryId: categories[1].id,
          colorId: colors[2].id
        }
      }),
      prisma.product.create({
        data: {
          title: 'AirPods Pro',
          description: 'Wireless earbuds with noise cancellation',
          price: 249.0,
          images: ['/uploads/products/airpods.webp'],
          storeId: stores[0].id,
          categoryId: categories[2].id,
          colorId: colors[1].id
        }
      }),
      prisma.product.create({
        data: {
          title: "Men's Casual Shirt",
          description: 'Comfortable cotton shirt for everyday wear',
          price: 45.0,
          images: ['/uploads/products/shirt.webp'],
          storeId: stores[1].id,
          categoryId: categories[3].id,
          colorId: colors[4].id
        }
      }),
      prisma.product.create({
        data: {
          title: "Women's Summer Dress",
          description: 'Light and elegant summer dress',
          price: 65.0,
          images: ['/uploads/products/dress.webp'],
          storeId: stores[1].id,
          categoryId: categories[4].id,
          colorId: colors[3].id
        }
      }),
      prisma.product.create({
        data: {
          title: 'Wooden Coffee Table',
          description: 'Elegant coffee table for your living room',
          price: 299.0,
          images: ['/uploads/products/table.webp'],
          storeId: stores[2].id,
          categoryId: categories[5].id,
          colorId: colors[6].id
        }
      }),
      prisma.product.create({
        data: {
          title: 'Kitchen Utensil Set',
          description: 'Complete set of kitchen utensils',
          price: 89.0,
          images: ['/uploads/products/utensils.webp'],
          storeId: stores[2].id,
          categoryId: categories[6].id,
          colorId: colors[2].id
        }
      })
    ]);

    console.log(`Created ${products.length} products`);

    const reviews = await Promise.all([
      prisma.review.create({
        data: {
          text: 'Great phone, excellent camera quality!',
          rating: 5,
          userId: users[1].id,
          productId: products[0].id,
          storeId: stores[0].id
        }
      }),
      prisma.review.create({
        data: {
          text: 'Good value for money but battery life could be better',
          rating: 4,
          userId: users[0].id,
          productId: products[1].id,
          storeId: stores[0].id
        }
      }),
      prisma.review.create({
        data: {
          text: 'Excellent performance, runs all my software smoothly',
          rating: 5,
          userId: users[2].id,
          productId: products[2].id,
          storeId: stores[0].id
        }
      }),
      prisma.review.create({
        data: {
          text: 'Material quality is good, fits well',
          rating: 4,
          userId: users[0].id,
          productId: products[4].id,
          storeId: stores[1].id
        }
      }),
      prisma.review.create({
        data: {
          text: 'Beautiful table, exactly as described',
          rating: 5,
          userId: users[1].id,
          productId: products[6].id,
          storeId: stores[2].id
        }
      })
    ]);

    console.log(`Created ${reviews.length} reviews`);

    const favorites = await Promise.all([
      prisma.userFavorite.create({
        data: {
          userId: users[1].id,
          productId: products[0].id
        }
      }),
      prisma.userFavorite.create({
        data: {
          userId: users[1].id,
          productId: products[2].id
        }
      }),
      prisma.userFavorite.create({
        data: {
          userId: users[0].id,
          productId: products[6].id
        }
      })
    ]);

    console.log(`Created ${favorites.length} favorites`);

    const orders = await Promise.all([
      prisma.order.create({
        data: {
          status: EnumOrderStatus.PAID,
          userId: users[1].id,
          total: 1248.99,
          items: {
            create: [
              {
                quantity: 1,
                price: 999.99,
                productId: products[0].id,
                storeId: stores[0].id
              },
              {
                quantity: 1,
                price: 249.0,
                productId: products[3].id,
                storeId: stores[0].id
              }
            ]
          }
        }
      }),
      prisma.order.create({
        data: {
          status: EnumOrderStatus.PENDING,
          userId: users[0].id,
          total: 65.0,
          items: {
            create: [
              {
                quantity: 1,
                price: 65.0,
                productId: products[5].id,
                storeId: stores[1].id
              }
            ]
          }
        }
      }),
      prisma.order.create({
        data: {
          status: EnumOrderStatus.PAID,
          userId: users[2].id,
          total: 388.0,
          items: {
            create: [
              {
                quantity: 1,
                price: 299.0,
                productId: products[6].id,
                storeId: stores[2].id
              },
              {
                quantity: 1,
                price: 89.0,
                productId: products[7].id,
                storeId: stores[2].id
              }
            ]
          }
        }
      })
    ]);

    console.log(`Created ${orders.length} orders`);
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
