import { BrainCog } from 'lucide-react';
import { InteractiveComponentMap } from './interactive-component-map';
import { SectionTitle } from './section-title';
import type { Field } from '@/types/form';

type MapCreateSectionProps = {
  fields: Field[];
};

export function MapCreateSection({ fields }: MapCreateSectionProps) {
  return (
    <div>
      <SectionTitle icon={BrainCog} title='Mapa de Criação' />
      <div className='grid grid-cols-1 gap-4 mt-6 w-full'>
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-xs">Nenhum campo criado ainda. Arraste campos para a área de criação</p>
          </div>
        ) : (
          fields.map((field) => (
            <InteractiveComponentMap
              key={field.id}
              title={field.label}
              type={field.type}
              value={field.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
