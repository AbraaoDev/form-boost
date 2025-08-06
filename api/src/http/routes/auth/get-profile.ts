import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { getProfileController } from '@/http/controllers/get-profile';
import { auth } from '@/http/middlewares/auth';

export async function getProfileRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/profile',
      {
        schema: {
          tags: ['auth'],
          summary: 'Get authenticated user profile',
          response: {
            200: z.object({
              user: z.object({
                id: z.cuid2(),
                name: z.string().nullable(),
                email: z.email(),
              }),
            }),
          },
        },
      },
      getProfileController,
    );
}
