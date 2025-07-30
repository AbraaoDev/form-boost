import type { FastifyReply, FastifyRequest } from 'fastify';
import { authenticateService } from '@/services/authenticate';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';
import type { AuthenticateBody } from '../../schemas/authenticate';

export async function authenticateController(
  request: FastifyRequest<{ Body: AuthenticateBody }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;
  try {
    const { user } = await authenticateService({ email, password });
    const token = await reply.jwtSign(
      {
        sub: user.id,
      },
      {
        sign: {
          expiresIn: '7d',
        },
      },
    );
    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message });
    }
    throw err;
  }
}
