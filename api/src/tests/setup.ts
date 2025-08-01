import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll } from 'vitest';

const prisma = new PrismaClient();

beforeAll(async () => {
  console.log('Configurando ambiente de testes...');
});

afterAll(async () => {
  await prisma.$disconnect();
  console.log('🧹 Limpeza do ambiente de testes concluída');
});
