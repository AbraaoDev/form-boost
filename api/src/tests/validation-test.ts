import { DeleteFormSubmissionExamples } from '@/examples/delete-form-submission-examples';
import { FormValidationExamples } from '@/examples/form-validation-examples';
import { GetFormExamples } from '@/examples/get-form-examples';
import { ListFormSubmissionsExamples } from '@/examples/list-form-submissions-examples';
import { SubmitFormExamples } from '@/examples/submit-form-examples';
import { UpdateFormExamples } from '@/examples/update-form-examples';

export async function runValidationTests() {
  console.log('🚀 Iniciando testes de validação...\n');

  // Testes de validação de formulários
  console.log('📋 Testando validação de formulários...');

  // Teste 1: Formulário de paciente válido
  console.log('✅ Teste 1: Formulário de paciente válido');
  const patientForm = FormValidationExamples.getPatientFormExample();
  FormValidationExamples.testFormValidation(patientForm);

  // Teste 2: Formulário com dependência circular
  console.log('\n❌ Teste 2: Formulário com dependência circular');
  const circularForm = FormValidationExamples.getCircularDependencyExample();
  FormValidationExamples.testFormValidation(circularForm);

  // Teste 3: Formulário com validações complexas
  console.log('\n🔍 Teste 3: Formulário com validações complexas');
  const complexForm = FormValidationExamples.getComplexValidationExample();
  FormValidationExamples.testFormValidation(complexForm);

  console.log('\n' + '='.repeat(50) + '\n');

  // Testes de update de formulários
  console.log('🔄 Testando update de formulários...');
  await UpdateFormExamples.testUpdateFormExamples();

  console.log('\n' + '='.repeat(50) + '\n');

  // Testes de get-form-by-id
  console.log('📄 Testando get-form-by-id...');
  await GetFormExamples.testGetFormById();

  console.log('\n' + '='.repeat(50) + '\n');

  // Testes de submit-form
  console.log('📤 Testando submit-form...');
  await SubmitFormExamples.testSubmitFormExamples();

  console.log('\n' + '='.repeat(50) + '\n');

  // Testes de list-form-submissions
  console.log('📊 Testando list-form-submissions...');
  await ListFormSubmissionsExamples.testListFormSubmissionsExamples();

  console.log('\n' + '='.repeat(50) + '\n');

  // Testes de delete-form-submission
  console.log('🗑️ Testando delete-form-submission...');
  await DeleteFormSubmissionExamples.testDeleteFormSubmissionExamples();

  console.log('\n✅ Todos os testes concluídos!');
}

if (require.main === module) {
  runValidationTests();
}
