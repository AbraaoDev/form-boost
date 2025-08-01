#!/usr/bin/env tsx

import { runValidationTests } from '../src/tests/validation-test';

console.log('🚀 Executando testes de validação...\n');

try {
  runValidationTests();
  console.log('\n✅ Todos os testes executados com sucesso!');
} catch (error) {
  console.error('\n❌ Erro durante a execução dos testes:', error);
  process.exit(1);
}
