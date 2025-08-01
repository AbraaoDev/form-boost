import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GetFormByIdParams } from '@/schemas/get-form-by-id';
import { getFormByIdService } from '@/services/get-form-by-id';

export async function getFormByIdController(
  request: FastifyRequest<{ Params: GetFormByIdParams }>,
  reply: FastifyReply,
) {
  const userId = await request.requireAuth(reply);
  
  const result = await getFormByIdService(request.params.id);
  return reply.status(200).send(result);
}
