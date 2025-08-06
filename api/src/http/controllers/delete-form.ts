import type { FastifyReply, FastifyRequest } from 'fastify';
import { deleteFormService } from '@/services/delete-form';

export async function deleteFormController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const userId = await request.requireAuth(reply);

  const result = await deleteFormService(request.params.id, userId);
  return reply.status(200).send(result);
}
