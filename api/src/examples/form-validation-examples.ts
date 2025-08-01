import { FormValidationService } from '@/services/form-validation';

export class FormValidationExamples {
  static getPatientFormExample() {
    return {
      name: 'Cadastro de Paciente',
      description: 'Formulário para cadastro de dados do paciente',
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
          id: 'data_nascimento',
          label: 'Data de Nascimento',
          type: 'date',
          required: true,
          min: '1900-01-01',
          max: '2025-07-31',
          validations: [{ type: 'future_date', allowed: false }],
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
        {
          id: 'nome_mae',
          label: 'Nome da Mãe',
          type: 'text',
          required: true,
          conditional: 'type_registro == "nascimento"',
          validations: [{ type: 'min_length', value: 3 }],
        },
      ],
    };
  }

  static getCircularDependencyExample() {
    return {
      name: 'Formulário com Dependência Circular',
      description: 'Exemplo de formulário inválido com dependência circular',
      fields: [
        {
          id: 'campo_a',
          label: 'Campo A',
          type: 'calculated',
          required: false,
          formula: 'campo_b + 1',
          dependencies: ['campo_b'],
        },
        {
          id: 'campo_b',
          label: 'Campo B',
          type: 'calculated',
          required: false,
          formula: 'campo_a + 1',
          dependencies: ['campo_a'],
        },
      ],
    };
  }

  static getComplexValidationExample() {
    return {
      name: 'Formulário com Validações Complexas',
      description: 'Exemplo de formulário com validações avançadas',
      fields: [
        {
          id: 'email',
          label: 'E-mail',
          type: 'text',
          required: true,
          validations: [
            {
              type: 'regex',
              value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            },
          ],
        },
        {
          id: 'confirmar_email',
          label: 'Confirmar E-mail',
          type: 'text',
          required: true,
          validations: [
            {
              type: 'regex',
              value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            },
          ],
        },
        {
          id: 'idade',
          label: 'Idade',
          type: 'number',
          format: 'integer',
          required: true,
          validations: [
            { type: 'min', value: 18 },
            { type: 'max', value: 65 },
          ],
        },
        {
          id: 'beneficios',
          label: 'Benefícios Desejados',
          type: 'select',
          multiple: true,
          required: false,
          options: [
            { label: 'Vale Refeição', value: 'vr' },
            { label: 'Vale Transporte', value: 'vt' },
            { label: 'Plano de Saúde', value: 'saude' },
            { label: 'Plano Odontológico', value: 'odontologico' },
          ],
        },
        {
          id: 'tem_beneficios',
          label: 'Possui Benefícios?',
          type: 'boolean',
          required: true,
          conditional: "'vr' in beneficios || 'vt' in beneficios",
        },
      ],
    };
  }

  static testFormValidation(formData: any) {
    console.log('---');
    console.log(`=== Testando Validação do Schema: ${formData.name} ===`);

    const result = FormValidationService.validateForm(formData.fields);

    if (result.isValid) {
      console.log('✅ Schema do formulário é válido!');
    } else {
      console.log('❌ Schema do formulário é inválido:');
      result.errors.forEach((error, index) => {
        console.log(
          `  ${index + 1}. [${error.field}] ${error.message} (type: ${error.type})`,
        );
      });
    }
    console.log('---');
    return result;
  }
}

const patientForm = FormValidationExamples.getPatientFormExample();
FormValidationExamples.testFormValidation(patientForm);

const circularForm = FormValidationExamples.getCircularDependencyExample();
FormValidationExamples.testFormValidation(circularForm);

const complexForm = FormValidationExamples.getComplexValidationExample();
FormValidationExamples.testFormValidation(complexForm);
