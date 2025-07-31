import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UpdateFormSchemaVersionBody } from '@/schemas/update-form';
import { 
  updateFormSchemaVersionService, 
  FormNotFoundError, 
  InvalidSchemaVersionError, 
  InvalidSchemaError 
} from '@/services/update-form';

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
    if (err instanceof FormNotFoundError) {
      return reply.status(404).send({
        error: 'form_not_found',
        message: err.message,
      });
    }
    
    if (err instanceof InvalidSchemaVersionError) {
      return reply.status(422).send({
        error: err.err,
        message: err.message,
      });
    }
    
    if (err instanceof InvalidSchemaError) {
      return reply.status(422).send({
        error: err.err,
        message: err.message,
        errors: err.errors,
      });
    }
    
    return reply.status(500).send({
      error: 'internal_server_error',
      message: 'Internal server error',
    });
  }
}
