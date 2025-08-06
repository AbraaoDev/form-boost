import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { BaseError } from '@/errors';

export async function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Validation error',
      issues: error.format(),
    });
  }

  if (
    (error as any).statusCode === 400 &&
    (error as any).code === 'FST_ERR_VALIDATION'
  ) {
    return reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: 'Validation error',
      issues:
        (error as any).validation?.map((issue: any) => ({
          field: issue.instancePath,
          message: issue.message,
          code: issue.keyword,
        })) || [],
    });
  }

  if (error instanceof BaseError) {
    return reply.status(error.statusCode).send(error.toJSON());
  }

  console.error('Unhandled error:', error);

  return reply.status(500).send({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
  });
}
