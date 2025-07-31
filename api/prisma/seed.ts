import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.versionSchema.deleteMany();
  await prisma.form.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash('123456', 1);

  const user = await prisma.user.create({
    data: {
      name: 'Solu SENAI',
      email: 'solusenai@fiepe.org.br',
      passwordHash,
    },
  });

  function randomFields() {
    return [
      {
        id: 'nome_completo',
        label: 'Nome completo',
        type: 'text',
        necessary: true,
        captilize: true,
        multirow: false,
        validations: [
          { type: 'tamanho_minimo', value: 5 },
          { type: 'regex', value: '^[A-Z][a-z]+( [A-Z][a-z]+)*$' },
        ],
      },
      {
        id: 'idade',
        label: 'Idade',
        type: 'number',
        format: 'inteiro',
        necessary: true,
        validations: [
          { type: 'minimo', value: 18 },
          { type: 'maximo', value: 65 },
        ],
      },
      {
        id: 'aceita_termos',
        label: 'Aceita os termos e condições?',
        type: 'boolean',
        necessary: true,
        condition: 'idade >= 18',
      },
    ];
  }

  const formsData = [
    {
      name: 'Ficha de Admissao',
      description: 'Formulário usado no onboarding de colaboradores',
      fields: randomFields(),
    },
    {
      name: 'Pesquisa de Satisfação',
      description: 'Formulário para medir satisfação do cliente',
      fields: [
        {
          id: 'satisfacao',
          label: 'Nível de satisfação',
          type: 'select',
          necessary: true,
          options: ['Ruim', 'Regular', 'Bom', 'Ótimo'],
        },
        {
          id: 'comentario',
          label: 'Comentário',
          type: 'text',
          necessary: false,
          multirow: true,
        },
      ],
    },
    {
      name: 'Cadastro de Evento',
      description: 'Formulário para inscrição em eventos',
      fields: [
        {
          id: 'nome',
          label: 'Nome do participante',
          type: 'text',
          necessary: true,
        },
        {
          id: 'email',
          label: 'E-mail',
          type: 'text',
          necessary: true,
          validations: [
            { type: 'regex', value: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
          ],
        },
        {
          id: 'data_nascimento',
          label: 'Data de nascimento',
          type: 'date',
          necessary: true,
        },
      ],
    },
    ...Array.from({ length: 7 }).map((_, i) => ({
      name: `${faker.company.name()} Formulário`,
      description: faker.lorem.sentence(),
      fields: [
        {
          id: `campo_texto_${i}`,
          label: faker.lorem.words(2),
          type: 'text',
          necessary: faker.datatype.boolean(),
          multirow: faker.datatype.boolean(),
        },
        {
          id: `campo_numero_${i}`,
          label: faker.lorem.words(2),
          type: 'number',
          necessary: faker.datatype.boolean(),
          validations: [
            { type: 'minimo', value: faker.number.int({ min: 1, max: 10 }) },
            { type: 'maximo', value: faker.number.int({ min: 11, max: 100 }) },
          ],
        },
        {
          id: `campo_data_${i}`,
          label: `Data ${faker.word.noun()}`,
          type: 'date',
          necessary: faker.datatype.boolean(),
        },
        {
          id: `campo_boolean_${i}`,
          label: `${faker.word.noun()} ativo?`,
          type: 'boolean',
          necessary: faker.datatype.boolean(),
        },
      ],
    })),
  ];

  for (const form of formsData) {
    await prisma.form.create({
      data: {
        name: form.name,
        description: form.description,
        userId: user.id,
        versions: {
          create: {
            fields: form.fields as any,
            schema_version: '1',
          },
        },
      },
    });
  }
}

seed().then(() => {
  console.log('🌱 Database seeded.');
});
