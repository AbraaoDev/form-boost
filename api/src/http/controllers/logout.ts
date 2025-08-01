import type { FastifyReply, FastifyRequest } from 'fastify';

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authToken = request.cookies['auth-token'];
  
  if (!authToken) {
    return reply.status(400).send({ 
      message: 'No active session found' 
    });
  }

  reply.clearCookie('auth-token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return reply.status(200).send({ message: 'Logged out successfully' });
} 