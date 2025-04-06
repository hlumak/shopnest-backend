import { FastifyRequest } from 'fastify';

export interface RequestWithCookies extends FastifyRequest {
  cookies: Record<string, string>;
}
