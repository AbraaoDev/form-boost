import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  ListFormSubmissionsParams,
  ListFormSubmissionsQuery,
} from '@/schemas/list-form-submissions';
import {
  extractFieldFilters,
  FormNotFoundError,
  InvalidPageError,
  InvalidParamError,
  listFormSubmissionsService,
} from '@/services/list-form-submissions';

export async function listFormSubmissionsController(
  request: FastifyRequest<{
    Params: ListFormSubmissionsParams;
    Querystring: ListFormSubmissionsQuery & Record<string, any>;
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = await request.requireAuth(reply);

    const { id } = request.params;
    const query = request.query;

    const fieldFilters = extractFieldFilters(query);

    const result = await listFormSubmissionsService(id, query, fieldFilters);

    return reply.status(200).send(result);
  } catch (err: any) {
    if (err instanceof FormNotFoundError) {
      return reply.status(404).send({
        erro: 'form_not_found',
        mensagem: err.message,
      });
    }

    if (err instanceof InvalidParamError) {
      return reply.status(400).send({
        error: 'invalid_params',
        message: err.message,
        field: err.field,
      });
    }

    if (err instanceof InvalidPageError) {
      return reply.status(422).send({
        error: 'invalid_page',
        message: err.message,
      });
    }

    console.error('Unexpected error in list-form-submissions:', err);
    return reply.status(500).send({
      error: 'internal_server_error',
      message: 'Internal server error.',
    });
  }
}
