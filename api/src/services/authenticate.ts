import { compare } from 'bcryptjs';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import type { AuthenticateBody } from '@/schemas/authenticate';
import { InvalidCredentialsError } from '@/errors';

export async function authenticateService({
  email,
  password,
}: AuthenticateBody) {
  const prismaUsersRepository = new PrismaUsersRepository();

  const user = await prismaUsersRepository.findByEmail(email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const doesPasswordMatches = await compare(password, user.passwordHash);

  if (!doesPasswordMatches) {
    throw new InvalidCredentialsError();
  }

  return {
    user,
  };
}
