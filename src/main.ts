import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import oauth2Plugin from './plugins/oauth2.plugin';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const fastifyInstance = app.getHttpAdapter().getInstance();

  await app.register(fastifyCookie, {
    secret: process.env.JWT_SECRET
  });

  await fastifyInstance.register(oauth2Plugin);

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  });

  app.enableCors({
    origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: 'set-cookie',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
  });

  const PORT = process.env.PORT || 4200;
  await app.listen(PORT, '0.0.0.0');
}
void bootstrap();
