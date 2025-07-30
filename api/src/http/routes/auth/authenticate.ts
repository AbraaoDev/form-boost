import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
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
        response: {
          400: z.object({
            message: z.string(),
          }),
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    authenticateController,
  );
}
