import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GetFormByIdParams } from '@/schemas/get-form-by-id';
import {
  FormNotFoundError,
  getFormByIdService,
  InvalidIdError,
} from '@/services/get-form-by-id';

export async function getFormByIdController(
  request: FastifyRequest<{ Params: GetFormByIdParams }>,
  reply: FastifyReply,
) {
  try {
    const result = await getFormByIdService(request.params.id);
    return reply.status(200).send(result);
  } catch (err: any) {
    if (err instanceof InvalidIdError) {
      return reply.status(422).send({
        error: 'invalid_id',
        message: err.message,
      });
    }
    if (err instanceof FormNotFoundError) {
      return reply.status(404).send({
        error: 'form_not_found',
        message: err.message,
      });
    }
    return reply.status(500).send({
      error: 'internal_error',
      message: 'Internal server error. Please try again later.',
    });
  }
}
