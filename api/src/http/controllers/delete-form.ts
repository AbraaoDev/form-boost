import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  deleteFormService,
  FormNotFoundError,
  FormProtectedError,
} from '@/services/delete-form';

export async function deleteFormController(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const userId = await request.getCurrentUserId();
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
    const result = await deleteFormService(request.params.id, userId);

    return reply.status(200).send(result);
  } catch (err: any) {
    if (err instanceof FormNotFoundError) {
      return reply.status(404).send({
        erro: 'form_not_found',
        mensagem: `The form with ID "${request.params.id}" was not found in system.`,
      });
    }
    if (err instanceof FormProtectedError) {
      return reply.status(409).send({
        erro: 'form_protected',
        mensagem:
          'This form is protected and cannot be deleted. Please contact support if you believe this is an error.',
      });
    }
    return reply.status(500).send({
      erro: 'fail_soft_delete',
      mensagem:
        'Internal server error while trying to soft delete the form. Please try again later.',
    });
  }
}
