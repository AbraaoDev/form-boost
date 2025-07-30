import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authenticateController } from '@/http/controllers/authenticate';
import { authenticateBodySchema } from '@/schemas/authenticate';

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
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
