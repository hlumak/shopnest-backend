import { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  [key: string]: string | number | boolean | null;
}

export interface OAuthUserData {
  user: {
    email: string;
    name: string;
    picture: string;
  };
}
