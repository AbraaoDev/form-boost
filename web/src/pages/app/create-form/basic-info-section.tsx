import { BadgeInfoIcon } from 'lucide-react';
import { InputField } from '@/components/ui/input/input-field';
import { SectionTitle } from './section-title';

export function BasicInfoSection() {
  return (
    <div>
      <SectionTitle icon={BadgeInfoIcon} title='Informações Básicas' />
      <div className='grid gap-4 mt-6 w-full'>
        <InputField
          label='Título do Formulário'
          placeholder='Insira o título'
          name='name'
        />

        <InputField
          label='Descrição'
          placeholder='Insira a descrição'
          name='description'
        />
      </div>
    </div>
  );
}
