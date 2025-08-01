import type { FastifyInstance, FastifyReply } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { UnauthorizedError } from '../routes/_errors/unauthorized-error';

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      const cookieToken = request.cookies['auth-token'];
      if (!cookieToken) {
        throw new UnauthorizedError();
      }

      try {
        request.headers.authorization = `Bearer ${cookieToken}`;
        const { sub } = await request.jwtVerify<{ sub: string }>();
        return sub;
      } catch {
        throw new UnauthorizedError();
      }
    };
    request.requireAuth = async (reply: FastifyReply): Promise<string> => {
      try {
        const userId = await request.getCurrentUserId();
        return userId;
      } catch {
        reply.status(401).send({ message: 'Unauthorized' });
        throw new UnauthorizedError();
      }
    };
  });
});
