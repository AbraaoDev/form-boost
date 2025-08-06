import type { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaUsersRepository } from '@/repositories';

export async function getProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = await request.requireAuth(reply);

  const usersRepository = new PrismaUsersRepository();
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  return reply.send({ user });
}
