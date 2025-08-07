import { hash } from 'bcryptjs';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import type { RegisterBody } from '@/schemas/register';
import { UserAlreadyExistsError } from '@/errors';

export async function registerService({ name, email, password }: RegisterBody) {
  const prismaUsersRepository = new PrismaUsersRepository();

  const userWithSameEmail = await prismaUsersRepository.findByEmail(email);

  if (userWithSameEmail) {
    throw new UserAlreadyExistsError();
  }

  const passwordHash = await hash(password, 6);

  await prismaUsersRepository.create({
    name,
    email,
    passwordHash,
  });
}
