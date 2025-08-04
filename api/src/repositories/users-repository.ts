import type { Prisma } from '@prisma/client';

export interface UsersRepository {
  findByEmail(email: string): Promise<Prisma.UserGetPayload<{}> | null>;
  findById(id: string): Promise<{
    id: string;
    name: string | null;
    email: string;
  } | null>;
  create(data: Prisma.UserCreateInput): Promise<Prisma.UserGetPayload<{}>>;
}
