import { FormSubmissionService } from '@/services/submit-form';

export class SubmitFormExamples {
  static getValidSubmissionExample() {
    return {
      id: 'formulario_001',
      answers: {
        nome_completo: 'Maria Santos',
        data_nascimento: '1995-02-14',
        ocupacao: 'ti',
      },
      userId: 'user123',
      schemaVersion: 3,
    };
  }

  static getValidSubmissionWithoutSchemaVersion() {
    return {
      id: 'formulario_001',
      answers: {
        nome_completo: 'João Silva',
        data_nascimento: '1990-05-15',
        ocupacao: 'eng',
      },
      userId: 'user123',
      // schemaVersion omitido - usa versão mais recente
    };
  }

  static getInvalidSubmissionMissingRequired() {
    return {
      id: 'formulario_001',
      answers: {
        // nome_completo ausente (obrigatório)
        data_nascimento: '1995-02-14',
        ocupacao: 'ti',
      },
      userId: 'user123',
    };
  }

  static getInvalidSubmissionWithCalculatedField() {
    return {
      id: 'formulario_001',
      answers: {
        nome_completo: 'Maria Santos',
        data_nascimento: '1995-02-14',
        ocupacao: 'ti',
        idade: 30, // Campo calculated não deve ser enviado
        e_maior_de_idade: true, // Campo calculated não deve ser enviado
      },
      userId: 'user123',
    };
  }

  static getInvalidSubmissionWithObsoleteSchema() {
    return {
      id: 'formulario_001',
      answers: {
        nome_completo: 'Maria Santos',
        data_nascimento: '1995-02-14',
        ocupacao: 'ti',
      },
      userId: 'user123',
      schemaVersion: 1, // Versão obsoleta
    };
  }

  static getInvalidSubmissionWithInvalidData() {
    return {
      id: 'formulario_001',
      answers: {
        nome_completo: '123', // Nome inválido (números)
        data_nascimento: 'invalid-date', // Data inválida
        ocupacao: 'invalid-option', // Opção inválida
      },
      userId: 'user123',
    };
  }

  static async testSubmitFormExamples() {
    console.log('🧪 Testando submit-form...\n');

    // Teste 1: Submissão válida com schema_version
    console.log('✅ Teste 1: Submissão válida com schema_version');
    try {
      const validExample = SubmitFormExamples.getValidSubmissionExample();
      console.log('Payload:', JSON.stringify(validExample, null, 2));
      console.log('Resultado esperado: 201 Created com campos calculados');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 2: Submissão válida sem schema_version
    console.log('\n✅ Teste 2: Submissão válida sem schema_version');
    try {
      const validWithoutVersion =
        SubmitFormExamples.getValidSubmissionWithoutSchemaVersion();
      console.log('Payload:', JSON.stringify(validWithoutVersion, null, 2));
      console.log('Resultado esperado: 201 Created (usa versão mais recente)');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 3: Campos obrigatórios ausentes
    console.log('\n❌ Teste 3: Campos obrigatórios ausentes');
    try {
      const missingRequired =
        SubmitFormExamples.getInvalidSubmissionMissingRequired();
      console.log('Payload:', JSON.stringify(missingRequired, null, 2));
      console.log('Resultado esperado: 400 - failed_validation');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 4: Campos calculated enviados
    console.log('\n❌ Teste 4: Campos calculated enviados');
    try {
      const withCalculated =
        SubmitFormExamples.getInvalidSubmissionWithCalculatedField();
      console.log('Payload:', JSON.stringify(withCalculated, null, 2));
      console.log('Resultado esperado: 422 - business_inconsistency');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 5: Schema obsoleto
    console.log('\n❌ Teste 5: Schema obsoleto');
    try {
      const obsoleteSchema =
        SubmitFormExamples.getInvalidSubmissionWithObsoleteSchema();
      console.log('Payload:', JSON.stringify(obsoleteSchema, null, 2));
      console.log('Resultado esperado: 409 - schema_outdated');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 6: Dados inválidos
    console.log('\n❌ Teste 6: Dados inválidos');
    try {
      const invalidData =
        SubmitFormExamples.getInvalidSubmissionWithInvalidData();
      console.log('Payload:', JSON.stringify(invalidData, null, 2));
      console.log('Resultado esperado: 422 - business_inconsistency');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    console.log('\n🎯 Testes concluídos!');
  }

  static getExpectedResponseStructure() {
    return {
      message: 'Resposta registrada com sucesso.',
      id_submit: 'resposta_12345',
      calculated: {
        idade: 30,
        e_maior_de_idade: true,
      },
      executed_at: '2024-03-15T22:12:01Z',
    };
  }

  static getExpectedErrorStructures() {
    return {
      // 400 - Campos obrigatórios ausentes
      failed_validation: {
        error: 'failed_validation',
        message: 'Some required fields were not completed.',
        errors: [
          {
            field: 'nome_completo',
            message: 'Campo obrigatório não informado.',
          },
        ],
      },

      // 422 - Inconsistência semântica
      business_inconsistency: {
        error: 'business_inconsistency',
        message: 'Inconsistent data detected.',
        errors: [
          {
            field: 'idade',
            message:
              'The calculated value is below that permitted for this occupation.',
          },
        ],
      },

      // 409 - Schema obsoleto
      schema_outdated: {
        error: 'schema_outdated',
        message:
          'The specified schema version is no longer accepted for new submissions.',
      },
    };
  }
}
