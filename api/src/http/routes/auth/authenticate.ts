import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticateController } from '@/http/controllers/authenticate';
import { authenticateBodySchema } from '@/http/schemas/authenticate';

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate a user',
        body: authenticateBodySchema,
      },
    },
    authenticateController,
  );
}
