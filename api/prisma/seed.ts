import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import chalk from 'chalk';

const prisma = new PrismaClient();

async function seed() {
  await prisma.formSubmission.deleteMany();
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

  console.log(chalk.green('User created:', user.email));

  const patientForm = await prisma.form.create({
    data: {
      name: 'Cadastro de Paciente',
      description:
        'Formulário para cadastro de dados do paciente com campos calculados',
      userId: user.id,
      versions: {
        create: {
          fields: [
            {
              id: 'nome_completo',
              label: 'Nome Completo',
              type: 'text',
              required: true,
              capitalize: true,
              multiline: false,
              validations: [
                { type: 'min_length', value: 3 },
                { type: 'max_length', value: 100 },
                { type: 'regex', value: '^[A-Za-zÀ-ú\\s]+$' },
                { type: 'not_contain', value: ['admin', 'root', 'null'] },
              ],
            },
            {
              id: 'idade',
              label: 'Idade',
              type: 'number',
              format: 'integer',
              required: true,
              validations: [
                { type: 'min', value: 0 },
                { type: 'max', value: 120 },
              ],
            },
            {
              id: 'peso',
              label: 'Peso (kg)',
              type: 'number',
              format: 'decimal',
              required: true,
              validations: [
                { type: 'min', value: 0 },
                { type: 'max', value: 300 },
                { type: 'multiple_of', value: 0.1 },
              ],
            },
            {
              id: 'altura',
              label: 'Altura (cm)',
              type: 'number',
              format: 'integer',
              required: true,
              validations: [
                { type: 'min', value: 50 },
                { type: 'max', value: 250 },
              ],
            },
            {
              id: 'imc',
              label: 'Índice de Massa Corporal',
              type: 'calculated',
              formula: 'peso / (altura/100)^2',
              dependencies: ['peso', 'altura'],
              precision: 2,
              required: false,
            },
            {
              id: 'classificacao_imc',
              label: 'Classificação IMC',
              type: 'calculated',
              formula:
                'if(imc < 18.5, "Abaixo do peso", if(imc < 25, "Peso normal", if(imc < 30, "Sobrepeso", "Obesidade")))',
              dependencies: ['imc'],
              required: false,
            },
            {
              id: 'data_nascimento',
              label: 'Data de Nascimento',
              type: 'date',
              required: true,
              min: '1900-01-01',
              max: '2025-12-31',
              validations: [{ type: 'future_date', allowed: false }],
            },
            {
              id: 'idade_calculada',
              label: 'Idade Calculada',
              type: 'calculated',
              formula: 'floor((now() - data_nascimento) / 365.25)',
              dependencies: ['data_nascimento'],
              required: false,
            },
            {
              id: 'sexo',
              label: 'Sexo',
              type: 'select',
              multiple: false,
              required: true,
              options: [
                { label: 'Masculino', value: 'masculino' },
                { label: 'Feminino', value: 'feminino' },
                { label: 'Outro', value: 'outro' },
              ],
            },
            {
              id: 'aceita_termos',
              label: 'Aceita os termos e condições?',
              type: 'boolean',
              required: true,
              validations: [{ type: 'expected_value', value: true }],
            },
          ],
          schema_version: '1',
        },
      },
    },
  });

  const taxForm = await prisma.form.create({
    data: {
      name: 'Cálculo de Impostos',
      description:
        'Formulário para cálculo de impostos com dependências complexas',
      userId: user.id,
      versions: {
        create: {
          fields: [
            {
              id: 'nome_empresa',
              label: 'Nome da Empresa',
              type: 'text',
              required: true,
              capitalize: true,
              validations: [
                { type: 'min_length', value: 2 },
                { type: 'max_length', value: 100 },
              ],
            },
            {
              id: 'faturamento_anual',
              label: 'Faturamento Anual (R$)',
              type: 'number',
              format: 'decimal',
              required: true,
              validations: [
                { type: 'min', value: 0 },
                { type: 'max', value: 1000000000 },
              ],
            },
            {
              id: 'numero_funcionarios',
              label: 'Número de Funcionários',
              type: 'number',
              format: 'integer',
              required: true,
              validations: [
                { type: 'min', value: 1 },
                { type: 'max', value: 10000 },
              ],
            },
            {
              id: 'setor_atividade',
              label: 'Setor de Atividade',
              type: 'select',
              multiple: false,
              required: true,
              options: [
                { label: 'Comércio', value: 'comercio' },
                { label: 'Indústria', value: 'industria' },
                { label: 'Serviços', value: 'servicos' },
                { label: 'Tecnologia', value: 'tecnologia' },
                { label: 'Saúde', value: 'saude' },
                { label: 'Educação', value: 'educacao' },
              ],
            },
            {
              id: 'faturamento_medio_funcionario',
              label: 'Faturamento Médio por Funcionário',
              type: 'calculated',
              formula: 'faturamento_anual / numero_funcionarios',
              dependencies: ['faturamento_anual', 'numero_funcionarios'],
              precision: 2,
              required: false,
            },
            {
              id: 'aliquota_irpj',
              label: 'Alíquota IRPJ (%)',
              type: 'calculated',
              formula:
                'if(faturamento_anual <= 240000, 6, if(faturamento_anual <= 360000, 11.2, 15))',
              dependencies: ['faturamento_anual'],
              precision: 1,
              required: false,
            },
            {
              id: 'valor_irpj',
              label: 'Valor IRPJ (R$)',
              type: 'calculated',
              formula: 'faturamento_anual * (aliquota_irpj / 100)',
              dependencies: ['faturamento_anual', 'aliquota_irpj'],
              precision: 2,
              required: false,
            },
            {
              id: 'aliquota_csll',
              label: 'Alíquota CSLL (%)',
              type: 'calculated',
              formula:
                'if(faturamento_anual <= 240000, 3, if(faturamento_anual <= 360000, 5.6, 9))',
              dependencies: ['faturamento_anual'],
              precision: 1,
              required: false,
            },
            {
              id: 'valor_csll',
              label: 'Valor CSLL (R$)',
              type: 'calculated',
              formula: 'faturamento_anual * (aliquota_csll / 100)',
              dependencies: ['faturamento_anual', 'aliquota_csll'],
              precision: 2,
              required: false,
            },
            {
              id: 'total_impostos',
              label: 'Total de Impostos (R$)',
              type: 'calculated',
              formula: 'valor_irpj + valor_csll',
              dependencies: ['valor_irpj', 'valor_csll'],
              precision: 2,
              required: false,
            },
            {
              id: 'percentual_impostos',
              label: 'Percentual de Impostos (%)',
              type: 'calculated',
              formula: '(total_impostos / faturamento_anual) * 100',
              dependencies: ['total_impostos', 'faturamento_anual'],
              precision: 2,
              required: false,
            },
            {
              id: 'data_calculo',
              label: 'Data do Cálculo',
              type: 'date',
              required: true,
              min: '2020-01-01',
              max: '2030-12-31',
            },
            {
              id: 'aceita_calculo',
              label: 'Aceita o cálculo apresentado?',
              type: 'boolean',
              required: true,
              conditional: 'percentual_impostos <= 20',
            },
          ],
          schema_version: '1',
        },
      },
    },
  });

  console.log(chalk.green('Forms created:', patientForm.name, taxForm.name));

  const patientSubmissions = [
    {
      data: {
        nome_completo: 'João Silva Santos',
        idade: 35,
        peso: 75.5,
        altura: 175,
        data_nascimento: '1988-05-15',
        sexo: 'masculino',
        aceita_termos: true,
      },
    },
    {
      data: {
        nome_completo: 'Maria Oliveira Costa',
        idade: 28,
        peso: 62.0,
        altura: 165,
        data_nascimento: '1995-08-22',
        sexo: 'feminino',
        aceita_termos: true,
      },
    },
    {
      data: {
        nome_completo: 'Pedro Almeida Lima',
        idade: 42,
        peso: 85.2,
        altura: 180,
        data_nascimento: '1981-12-03',
        sexo: 'masculino',
        aceita_termos: true,
      },
    },
  ];

  for (const submission of patientSubmissions) {
    await prisma.formSubmission.create({
      data: {
        formId: patientForm.id,
        userId: user.id,
        data: submission.data,
      },
    });
  }

  const taxSubmissions = [
    {
      data: {
        nome_empresa: 'Tech Solutions Ltda',
        faturamento_anual: 180000,
        numero_funcionarios: 8,
        setor_atividade: 'tecnologia',
        data_calculo: '2024-01-15',
        aceita_calculo: true,
      },
    },
    {
      data: {
        nome_empresa: 'Comércio Popular Ltda',
        faturamento_anual: 350000,
        numero_funcionarios: 15,
        setor_atividade: 'comercio',
        data_calculo: '2024-01-20',
        aceita_calculo: false,
      },
    },
  ];

  for (const submission of taxSubmissions) {
    await prisma.formSubmission.create({
      data: {
        formId: taxForm.id,
        userId: user.id,
        data: submission.data,
      },
    });
  }

  console.log(chalk.green('Submissions created: TaxForm and PatientForm'));
}

seed().then(() => {
  console.log('🌱 Database seeded.');
  console.log(chalk.blue.bgGreen.bold('\nCredentials:'));
  console.log(`  Email: solusenai@fiepe.org.br`);
  console.log(`  Senha: 123456`);
});
