export class DeleteFormSubmissionExamples {
  static getValidDeleteExample() {
    return {
      formId: 'formulario_abc',
      submitId: 'resposta_001',
      userId: 'usuario_admin',
    };
  }

  static getNonExistentFormExample() {
    return {
      formId: 'formulario_inexistente',
      submitId: 'resposta_001',
      userId: 'usuario_admin',
    };
  }

  static getNonExistentSubmitExample() {
    return {
      formId: 'formulario_abc',
      submitId: 'resposta_inexistente',
      userId: 'usuario_admin',
    };
  }

  static getAlreadyRemovedSubmitExample() {
    return {
      formId: 'formulario_abc',
      submitId: 'resposta_ja_removida',
      userId: 'usuario_admin',
    };
  }

  static getInactiveFormExample() {
    return {
      formId: 'formulario_inativo',
      submitId: 'resposta_001',
      userId: 'usuario_admin',
    };
  }

  static getProtectedSubmitExample() {
    return {
      formId: 'formulario_abc',
      submitId: 'resposta_protegida',
      userId: 'usuario_admin',
    };
  }

  static async testDeleteFormSubmissionExamples() {
    console.log('🧪 Testando delete-form-submission...\n');

    // Teste 1: Delete válido
    console.log('✅ Teste 1: Delete válido');
    try {
      const validExample = DeleteFormSubmissionExamples.getValidDeleteExample();
      console.log('Parâmetros:', JSON.stringify(validExample, null, 2));
      console.log('Resultado esperado: 200 OK com soft delete');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 2: Formulário não encontrado
    console.log('\n❌ Teste 2: Formulário não encontrado');
    try {
      const nonExistentForm =
        DeleteFormSubmissionExamples.getNonExistentFormExample();
      console.log('Parâmetros:', JSON.stringify(nonExistentForm, null, 2));
      console.log('Resultado esperado: 404 - form_not_found');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 3: Submissão não encontrada
    console.log('\n❌ Teste 3: Submissão não encontrada');
    try {
      const nonExistentSubmit =
        DeleteFormSubmissionExamples.getNonExistentSubmitExample();
      console.log('Parâmetros:', JSON.stringify(nonExistentSubmit, null, 2));
      console.log('Resultado esperado: 404 - submit_not_found');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 4: Submissão já removida
    console.log('\n❌ Teste 4: Submissão já removida');
    try {
      const alreadyRemoved =
        DeleteFormSubmissionExamples.getAlreadyRemovedSubmitExample();
      console.log('Parâmetros:', JSON.stringify(alreadyRemoved, null, 2));
      console.log('Resultado esperado: 410 - submit_already_removed');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 5: Formulário inativo
    console.log('\n❌ Teste 5: Formulário inativo');
    try {
      const inactiveForm =
        DeleteFormSubmissionExamples.getInactiveFormExample();
      console.log('Parâmetros:', JSON.stringify(inactiveForm, null, 2));
      console.log('Resultado esperado: 403 - inactive_form');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 6: Submissão protegida
    console.log('\n❌ Teste 6: Submissão protegida');
    try {
      const protectedSubmit =
        DeleteFormSubmissionExamples.getProtectedSubmitExample();
      console.log('Parâmetros:', JSON.stringify(protectedSubmit, null, 2));
      console.log('Resultado esperado: 423 - submit_blocked');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    console.log('\n🎯 Testes concluídos!');
  }

  static getExpectedResponseStructure() {
    return {
      message: "Submit 'response_001' marked as inactive successfully.",
      status: 'soft_deleted',
    };
  }

  static getExpectedErrorStructures() {
    return {
      // 404 - Formulário não encontrado
      form_not_found: {
        error: 'form_not_found',
        message:
          "The form 'formulario_inexistente' does not exist or is inactive.",
      },

      // 404 - Submissão não encontrada
      submit_not_found: {
        error: 'submit_not_found',
        message:
          "The submit 'resposta_inexistente' was not found for the form 'formulario_abc'.",
      },

      // 410 - Já removida anteriormente
      submit_already_removed: {
        error: 'submit_already_removed',
        message:
          'The submit is already inactive. No further action has been taken.',
      },

      // 403 - Formulário inativo
      inactive_form: {
        error: 'inactive_form',
        message:
          'This form has been disabled and does not allow changes to your answers.',
      },

      // 423 - Resposta protegida
      submit_blocked: {
        erro: 'submit_blocked',
        mensagem:
          'The response is protected and cannot be removed due to retention policies.',
      },
    };
  }

  static getExpectedLogStructure() {
    return {
      action: 'logic_remove',
      entitie: 'submit',
      id_form: 'formulario_abc',
      id_submit: 'resposta_001',
      user: 'usuario_admin',
      date_hour: '2024-03-15T23:59:59Z',
    };
  }
}
