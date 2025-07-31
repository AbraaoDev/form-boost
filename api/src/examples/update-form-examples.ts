import { UpdateFormService } from '@/services/update-form';

export class UpdateFormExamples {
  static getValidUpdateExample() {
    return {
      schema_version: 3,
      name: "Formulário de Cadastro de Pessoas (v3)",
      description: "Versão revisada com validações de idade e ocupação",
      fields: [
        {
          id: "nome_completo",
          label: "Nome completo",
          type: "text",
          required: true,
          validations: [
            { type: "max_length", value: 100 }
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
          label: "Idade (auto)",
          type: "calculated",
          required: false,
          formula: "floor((today() - data_nascimento) / 365.25)",
          dependencies: ["data_nascimento"],
          precision: 0
        },
        {
          id: "ocupacao",
          label: "Área de atuação",
          type: "select",
          required: true,
          options: [
            { label: "TI", value: "ti" },
            { label: "Educação", value: "edu" },
            { label: "Saúde", value: "saude" }
          ]
        },
        {
          id: "e_maior_de_idade",
          label: "É maior de idade?",
          type: "calculated",
          required: false,
          formula: "idade >= 18",
          dependencies: ["idade"]
        }
      ]
    };
  }

  static getInvalidVersionExample() {
    return {
      schema_version: 1, 
      name: "Formulário de Teste",
      description: "Descrição de teste",
      fields: [
        {
          id: "campo_teste",
          label: "Campo de teste",
          type: "text",
          required: true
        }
      ]
    };
  }

  static getCircularDependencyExample() {
    return {
      schema_version: 4,
      name: "Formulário com Dependência Circular",
      description: "Exemplo com dependência circular",
      fields: [
        {
          id: "campo_a",
          label: "Campo A",
          type: "calculated",
          required: false,
          formula: "campo_b + 1",
          dependencies: ["campo_b"]
        },
        {
          id: "campo_b",
          label: "Campo B",
          type: "calculated",
          required: false,
          formula: "campo_a + 1",
          dependencies: ["campo_a"]
        }
      ]
    };
  }

  static getInvalidFieldExample() {
    return {
      schema_version: 5,
      name: "Formulário com Campo Inválido",
      description: "Exemplo com campo inválido",
      fields: [
        {
          id: "nome",
          label: "Nome",
          type: "text",
          required: true
        },
        {
          id: "idade_calculada",
          label: "Idade Calculada",
          type: "calculated",
          required: false,
          formula: "idade + 1",
          dependencies: ["idade"] 
        }
      ]
    };
  }

  static getDuplicateOptionsExample() {
    return {
      schema_version: 6,
      name: "Formulário com Opções Duplicadas",
      description: "Exemplo com opções duplicadas",
      fields: [
        {
          id: "categoria",
          label: "Categoria",
          type: "select",
          required: true,
          options: [
            { label: "TI", value: "ti" },
            { label: "TI", value: "ti" }, 
            { label: "Educação", value: "edu" }
          ]
        }
      ]
    };
  }

  static async testUpdateFormExamples() {
    console.log('🧪 Testando exemplos de update-form...\n');

    const service = new UpdateFormService();

    // Teste 1: Exemplo válido
    console.log('✅ Teste 1: Exemplo válido');
    try {
      const validExample = this.getValidUpdateExample();
      console.log('Payload:', JSON.stringify(validExample, null, 2));
      console.log('Resultado: Exemplo válido (simulado)');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 2: Versão inválida
    console.log('\n❌ Teste 2: Versão inválida');
    try {
      const invalidVersionExample = this.getInvalidVersionExample();
      console.log('Payload:', JSON.stringify(invalidVersionExample, null, 2));
      console.log('Resultado: Deve retornar erro de versão inválida');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 3: Dependência circular
    console.log('\n❌ Teste 3: Dependência circular');
    try {
      const circularExample = this.getCircularDependencyExample();
      console.log('Payload:', JSON.stringify(circularExample, null, 2));
      console.log('Resultado: Deve retornar erro de dependência circular');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 4: Campo inválido
    console.log('\n❌ Teste 4: Campo inválido');
    try {
      const invalidFieldExample = this.getInvalidFieldExample();
      console.log('Payload:', JSON.stringify(invalidFieldExample, null, 2));
      console.log('Resultado: Deve retornar erro de campo inválido');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    // Teste 5: Opções duplicadas
    console.log('\n❌ Teste 5: Opções duplicadas');
    try {
      const duplicateOptionsExample = this.getDuplicateOptionsExample();
      console.log('Payload:', JSON.stringify(duplicateOptionsExample, null, 2));
      console.log('Resultado: Deve retornar erro de opções duplicadas');
    } catch (error) {
      console.log('❌ Erro:', error);
    }

    console.log('\n🎯 Testes concluídos!');
  }
} 