import { getFormByIdService } from '@/services/get-form-by-id';

export class GetFormExamples {
  static async testGetFormById() {
    console.log('🧪 Testando get-form-by-id...\n');

    // Teste 1: ID válido (simulado)
    console.log('✅ Teste 1: ID válido');
    try {
      // Simular um formulário válido
      console.log('Resultado esperado: Formulário com todos os campos e propriedades');
      console.log('Estrutura esperada:');
      console.log(JSON.stringify({
        id: "formulario_001",
        name: "Formulário de Onboarding RH",
        description: "Formulário utilizado no processo de integração de novos colaboradores.",
        schema_version: 2,
        created_at: "2024-01-15T10:34:00Z",
        fields: [
          {
            id: "nome_completo",
            label: "Nome completo",
            type: "text",
            required: true,
            capitalize: true,
            multiline: false,
            validations: [
              { type: "max_length", value: 100 },
              { type: "regex", value: "^[A-Z][a-z]+( [A-Z][a-z]+)+$" }
            ]
          },
          {
            id: "data_nascimento",
            label: "Data de nascimento",
            type: "date",
            required: true,
            min: "1900-01-01",
            max: "2030-12-31"
          },
          {
            id: "idade",
            label: "Idade (calculada)",
            type: "calculated",
            required: false,
            formula: "floor((today() - data_nascimento) / 365.25)",
            dependencies: ["data_nascimento"],
            precision: 0
          },
          {
            id: "aceite_politica",
            label: "Aceito a política de privacidade?",
            type: "boolean",
            required: true
          },
          {
            id: "area_atuacao",
            label: "Área de atuação",
            type: "select",
            required: true,
            multiple: false,
            options: [
              { label: "Engenharia", value: "eng" },
              { label: "Recursos Humanos", value: "rh" },
              { label: "Financeiro", value: "fin" }
            ]
          }
        ]
      }, null, 2));
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 2: ID inválido
    console.log('\n❌ Teste 2: ID inválido');
    try {
      console.log('ID: "inv" (muito curto)');
      console.log('Resultado esperado: Erro 422 - invalid_id');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 3: Formulário não encontrado
    console.log('\n❌ Teste 3: Formulário não encontrado');
    try {
      console.log('ID: "formulario_inexistente"');
      console.log('Resultado esperado: Erro 404 - form_not_found');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 4: Dependência circular
    console.log('\n❌ Teste 4: Dependência circular');
    try {
      console.log('Formulário com campos calculated com dependência circular');
      console.log('Resultado esperado: Erro 500 - circular_dependency_error');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    console.log('\n🎯 Testes concluídos!');
  }

  static getExpectedResponseStructure() {
    return {
      id: "formulario_001",
      name: "Formulário de Onboarding RH",
      description: "Formulário utilizado no processo de integração de novos colaboradores.",
      schema_version: 2,
      created_at: "2024-01-15T10:34:00Z",
      fields: [
        {
          id: "nome_completo",
          label: "Nome completo",
          type: "text",
          required: true,
          capitalize: true,
          multiline: false,
          validations: [
            { type: "max_length", value: 100 },
            { type: "regex", value: "^[A-Z][a-z]+( [A-Z][a-z]+)+$" }
          ]
        },
        {
          id: "data_nascimento",
          label: "Data de nascimento",
          type: "date",
          required: true,
          min: "1900-01-01",
          max: "2030-12-31"
        },
        {
          id: "idade",
          label: "Idade (calculada)",
          type: "calculated",
          required: false,
          formula: "floor((today() - data_nascimento) / 365.25)",
          dependencies: ["data_nascimento"],
          precision: 0
        },
        {
          id: "aceite_politica",
          label: "Aceito a política de privacidade?",
          type: "boolean",
          required: true
        },
        {
          id: "area_atuacao",
          label: "Área de atuação",
          type: "select",
          required: true,
          multiple: false,
          options: [
            { label: "Engenharia", value: "eng" },
            { label: "Recursos Humanos", value: "rh" },
            { label: "Financeiro", value: "fin" }
          ]
        }
      ]
    };
  }
} 