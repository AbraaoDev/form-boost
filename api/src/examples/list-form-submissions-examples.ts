import { extractFieldFilters } from '@/services/list-form-submissions';

export class ListFormSubmissionsExamples {
  static getValidQueryExample() {
    return {
      page: 1,
      length_page: 10,
      include_calculated: true,
      schema_version: 3,
      field_ocupacao: 'ti',
      field_nome_completo: 'Maria Santos'
    };
  }

  static getQueryWithoutCalculatedExample() {
    return {
      page: 1,
      length_page: 20,
      include_calculated: false,
      field_ocupacao: 'eng'
    };
  }

  static getQueryWithPaginationExample() {
    return {
      page: 2,
      length_page: 5,
      include_calculated: true
    };
  }

  static getInvalidQueryExample() {
    return {
      page: 1,
      length_page: 150, // Excede o máximo de 100
      include_calculated: true
    };
  }

  static getQueryWithInvalidPageExample() {
    return {
      page: 9999, // Página inexistente
      length_page: 10,
      include_calculated: true
    };
  }

  static async testListFormSubmissionsExamples() {
    console.log('🧪 Testando list-form-submissions...\n');

    // Teste 1: Query válida com filtros
    console.log('✅ Teste 1: Query válida com filtros');
    try {
      const validQuery = this.getValidQueryExample();
      console.log('Query:', JSON.stringify(validQuery, null, 2));
      console.log('Filtros extraídos:', extractFieldFilters(validQuery));
      console.log('Resultado esperado: 200 OK com submissões filtradas');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 2: Query sem campos calculados
    console.log('\n✅ Teste 2: Query sem campos calculados');
    try {
      const withoutCalculated = this.getQueryWithoutCalculatedExample();
      console.log('Query:', JSON.stringify(withoutCalculated, null, 2));
      console.log('Resultado esperado: 200 OK sem campos calculated');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 3: Query com paginação
    console.log('\n✅ Teste 3: Query com paginação');
    try {
      const withPagination = this.getQueryWithPaginationExample();
      console.log('Query:', JSON.stringify(withPagination, null, 2));
      console.log('Resultado esperado: 200 OK com paginação');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 4: Query inválida (length_page > 100)
    console.log('\n❌ Teste 4: Query inválida (length_page > 100)');
    try {
      const invalidQuery = this.getInvalidQueryExample();
      console.log('Query:', JSON.stringify(invalidQuery, null, 2));
      console.log('Resultado esperado: 400 - invalid_params');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 5: Página inexistente
    console.log('\n❌ Teste 5: Página inexistente');
    try {
      const invalidPage = this.getQueryWithInvalidPageExample();
      console.log('Query:', JSON.stringify(invalidPage, null, 2));
      console.log('Resultado esperado: 422 - invalid_page');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 6: Formulário não encontrado
    console.log('\n❌ Teste 6: Formulário não encontrado');
    try {
      console.log('ID: "formulario_inexistente"');
      console.log('Resultado esperado: 404 - form_not_found');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    console.log('\n🎯 Testes concluídos!');
  }

  static getExpectedResponseStructure() {
    return {
      page: 1,
      length_page: 10,
      total: 42,
      results: [
        {
          id_submit: "resposta_67890",
          created_at: "2024-03-15T22:10:01Z",
          schema_version: 3,
          answers: {
            nome_completo: "Maria Santos",
            data_nascimento: "1995-02-14",
            ocupacao: "ti"
          },
          calculated: {
            idade: 30,
            e_maior_de_idade: true
          }
        }
      ]
    };
  }

  static getExpectedErrorStructures() {
    return {
      form_not_found: {
        erro: "form_not_found",
        mensagem: "O formulário formulario_001 não existe ou está inativo."
      },

      invalid_params: {
        error: "invalid_params",
        message: "The parameter 'length_page' must be less than or equal to 100.",
        field: "length_page"
      },

      invalid_page: {
        error: "invalid_page",
        message: "Page 9999 contains no results."
      }
    };
  }

  static getFilterExamples() {
    return {

      field_ocupacao: "ti",

      field_nome_completo: "Maria Santos",

      field_data_nascimento: "1995-02-14",

      field_aceite_politica: true,
      
    };
  }
} 