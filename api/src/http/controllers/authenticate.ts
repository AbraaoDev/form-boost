import { compare } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import type { AuthenticateBody } from '../../schemas/authenticate';

export async function authenticateController(
  request: FastifyRequest<{ Body: AuthenticateBody }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const userFromEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (!userFromEmail) {
    return reply.status(404).send({ message: 'Invalid credentials.' });
  }

  const isPasswordValid = await compare(password, userFromEmail.passwordHash);

  if (!isPasswordValid) {
    return reply.status(401).send({ message: 'Invalid credentials.' });
  }
  const token = await reply.jwtSign(
    {
      sub: userFromEmail.id,
    },
    {
      sign: {
        expiresIn: '7d',
      },
    },
  );

  return reply.status(200).send({ token });
}
