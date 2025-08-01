import type { FastifyReply, FastifyRequest } from 'fastify';
import { FormSubmissionService } from '@/services/submit-form';
import type { SubmitFormBody } from '@/schemas/submit-form';

export async function submitFormController(
  request: FastifyRequest<{ 
    Params: { id: string };
    Body: SubmitFormBody;
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = await request.requireAuth(reply);

    const { id } = request.params;
    const { answers, schema_version } = request.body;

    const result = await FormSubmissionService.submitForm({
      id,
      answers,
      userId,
      schemaVersion: schema_version,
    });

    if (!result.success) {
      let statusCode = 400;
      
      if (result.message.includes('Schema version not found')) {
        statusCode = 422;
      } else if (result.message.includes('no longer accepted for new submissions')) {
        statusCode = 409;
      } else if (result.message.includes('Inconsistent data detected')) {
        statusCode = 422;
      }

      return reply.status(statusCode).send({
        error: statusCode === 409 ? 'schema_outdated' : 
               statusCode === 422 ? 'business_inconsistency' : 'failed_validation',
        message: result.message,
        errors: result.errors,
      });
    }

    return reply.status(201).send({
      message: result.message,
      id_submit: result.submissionId,
      calculated: result.calculatedValues,
      executed_at: result.executedAt,
    });
  } catch (err: any) {
    return reply.status(500).send({ 
      error: 'internal_server_error',
      message: 'Internal server error.',
    });
  }
} 