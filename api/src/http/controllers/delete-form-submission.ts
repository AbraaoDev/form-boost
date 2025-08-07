import type { FastifyReply, FastifyRequest } from 'fastify';
import type { DeleteFormSubmissionParams } from '@/schemas/delete-form-submission';
import { deleteFormSubmissionService } from '@/services/delete-form-submission';
import {
  FormNotFoundError,
  InactiveFormError,
  SoftDeleteFailError,
  SubmitAlreadyRemovedError,
  SubmitBlockedError,
  SubmitNotFoundError,
} from '@/errors';

export async function deleteFormSubmissionController(
  request: FastifyRequest<{ Params: DeleteFormSubmissionParams }>,
  reply: FastifyReply,
) {
  try {
    const userId = await request.requireAuth(reply);

    const { id, id_submit } = request.params;

    const result = await deleteFormSubmissionService(id, id_submit, userId);

    return reply.status(200).send({
      message: result.message,
      status: result.status,
    });
  } catch (err: any) {
    if (err instanceof FormNotFoundError) {
      return reply.status(404).send({
        error: 'form_not_found',
        message: err.message,
      });
    }

    if (err instanceof SubmitNotFoundError) {
      return reply.status(404).send({
        error: 'submit_not_found',
        message: err.message,
      });
    }

    if (err instanceof SubmitAlreadyRemovedError) {
      return reply.status(410).send({
        error: 'submit_already_removed',
        message: err.message,
      });
    }

    if (err instanceof InactiveFormError) {
      return reply.status(403).send({
        error: 'inactive_form',
        message: err.message,
      });
    }

    if (err instanceof SubmitBlockedError) {
      return reply.status(423).send({
        erro: 'submit_blocked',
        mensagem: err.message,
      });
    }

    if (err instanceof SoftDeleteFailError) {
      console.error('Soft delete error:', err.message);
      return reply.status(500).send({
        error: 'internal_server_error',
        message:
          'Internal server error while trying to soft delete the submit.',
      });
    }

    console.error('Unexpected error in delete-form-submission:', err);
    return reply.status(500).send({
      error: 'internal_server_error',
      message: 'Internal server error.',
    });
  }
}
