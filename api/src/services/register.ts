import { hash } from 'bcryptjs';
import type { RegisterBody } from '@/http/schemas/register';
import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';

export async function registerService({ name, email, password }: RegisterBody) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new Error('User with this email already exists.');
  }

  const passwordHash = await hash(password, 6);

  const prismaUsersRepository = new PrismaUsersRepository();

  await prismaUsersRepository.create({
    name,
    email,
    passwordHash,
  });
}
