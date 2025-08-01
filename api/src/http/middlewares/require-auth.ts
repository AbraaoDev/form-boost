import type { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = await request.getCurrentUserId();
    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
} 