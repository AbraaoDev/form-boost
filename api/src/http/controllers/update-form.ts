import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UpdateFormSchemaVersionBody } from '@/schemas/update-form';
import { updateFormSchemaVersionService } from '@/services/update-form';

export async function updateFormSchemaVersionController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateFormSchemaVersionBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const result = await updateFormSchemaVersionService(id, request.body);
  return reply.status(200).send(result);
}
