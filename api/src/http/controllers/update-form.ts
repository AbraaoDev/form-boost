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
  try {
    const { id } = request.params;
    const result = await updateFormSchemaVersionService(id, request.body);
    return reply.status(200).send(result);
  } catch (err: any) {
    if (err.status) {
      return reply.status(err.status).send(err);
    }
    return reply
      .status(500)
      .send({ erro: 'internal_error', mensagem: err.message });
  }
}
