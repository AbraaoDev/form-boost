import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';
import { registerService } from '@/services/register';
import type { RegisterBody } from '../../schemas/register';

export async function registerController(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply,
) {
  const { email, name, password } = request.body;

  try {
    await registerService({ email, name, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: err.message,
      });
    }

    throw err;
  }

  return reply.status(201).send();
}
