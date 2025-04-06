import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyOAuth2, { FastifyOAuth2Options } from '@fastify/oauth2';
import fp from 'fastify-plugin';

const oauth2Plugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyOAuth2, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET
      },
      auth: fastifyOAuth2.GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/auth/google',
    callbackUri: `${process.env.SERVER_URL}/auth/google/callback`
  } as FastifyOAuth2Options);
};

export default fp(oauth2Plugin);
