import type { FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from '@/services/errors/validation-error';

export async function validationErrorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ValidationError) {
    return reply.status(422).send(error.toJSON());
  }

  // 
  // if (error.name === 'ZodError') {
  //   return reply.status(422).send({
  //     error: 'VALIDATION_ERROR',
  //     message: 'Erro de validação do schema',
  //     details: error.message,
  //   });
  // }

  if (error.message.includes('Error validation:')) {
    return reply.status(422).send({
      error: 'BUSINESS_VALIDATION_ERROR',
      message: error.message,
    });
  }

  throw error;
} 