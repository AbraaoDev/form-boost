import type { FastifyReply, FastifyRequest } from 'fastify';
import { registerService } from '@/services/register';
import type { RegisterBody } from '../schemas/register';

export async function registerController(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply,
) {
  const { email, name, password } = request.body;

  try {
    await registerService({ email, name, password });
  } catch (err) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
