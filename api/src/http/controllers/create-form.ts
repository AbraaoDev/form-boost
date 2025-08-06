import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateFormBody } from '@/schemas/create-form';
import { createFormService } from '@/services/create-form';

export async function createFormController(
  request: FastifyRequest<{ Body: CreateFormBody }>,
  reply: FastifyReply,
) {
  try {
    const userId = await request.requireAuth(reply);

    const result = await createFormService(request.body, userId);

    return reply.status(201).send(result);
  } catch (err: any) {
    return reply.status(400).send({ message: err.message });
  }
}
