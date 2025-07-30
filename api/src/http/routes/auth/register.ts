import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerController } from '@/http/controllers/register';
import { registerBodySchema } from '@/schemas/register';

export async function register(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: registerBodySchema,
      },
    },
    registerController,
  );
}
