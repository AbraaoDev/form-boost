import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GetFormByIdParams } from '@/schemas/get-form-by-id';
import { getFormByIdService } from '@/services/get-form-by-id';

export async function getFormByIdController(
  request: FastifyRequest<{ Params: GetFormByIdParams }>,
  reply: FastifyReply,
) {
  const userId = await request.getCurrentUserId();
  if (!userId) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
  
  const result = await getFormByIdService(request.params.id);
  return reply.status(200).send(result);
}
