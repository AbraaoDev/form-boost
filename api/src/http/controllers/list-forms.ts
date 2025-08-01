import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ListFormsQuery } from '@/schemas/list-forms';
import {
  InvalidFilterError,
  InvalidParamError,
  listFormsService,
} from '@/services/list-forms';

export async function listFormsController(
  request: FastifyRequest<{ Querystring: ListFormsQuery }>,
  reply: FastifyReply,
) {
  try {
    const userId = await request.requireAuth(reply);
    const result = await listFormsService(request.query);
    return reply.status(200).send(result);
  } catch (err: any) {
    if (err instanceof InvalidParamError) {
      return reply.status(400).send({
        error: 'invalid_param',
        field: err.field,
        message: err.message,
      });
    }
    if (err instanceof InvalidFilterError) {
      return reply.status(422).send({
        error: 'invalid_filter',
        message: err.message,
      });
    }
    return reply.status(400).send({
      error: 'unknown_error',
      message: err.message,
    });
  }
}
