import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();
  await prisma.formulario.deleteMany();

  const passwordHash = await hash('123456', 1);

  const user = await prisma.user.create({
    data: {
      name: 'Solu SENAI',
      email: 'solusenai@fiepe.org.br',
      passwordHash,
    },
  });

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash,
    },
  });
}

seed().then(() => {
  console.log('🌱 Database seeded.');
});
