import {
  Calendar1,
  CheckCircle,
  DecimalsArrowRight,
  Sigma,
  TextCursor,
  TextSelect,
  ToggleLeft,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type FieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'date'
  | 'calculated';

type Dependency = {
  name: string;
  type?: 'dependency' | 'validation' | 'requirement';
};

type InteractiveComponentMapProps = {
  title: string;
  type: FieldType;
  dependencies?: Dependency[];
  value?: string;
  className?: string;
};

const typeConfig = {
  text: TextCursor,
  number: DecimalsArrowRight,
  boolean: ToggleLeft,
  select: TextSelect,
  date: Calendar1,
  calculated: Sigma,
} as const;

const dependencyTypeConfig = {
  dependency: 'Dependência',
  validation: 'Validação',
  requirement: 'Obrigatório',
} as const;

export function InteractiveComponentMap({
  title,
  type,
  dependencies = [],
  value = 'item-1',
  className = 'border rounded-md',
}: InteractiveComponentMapProps) {
  const IconComponent = typeConfig[type];

  return (
    <Accordion type='single' collapsible className={className}>
      <AccordionItem value={value}>
        <AccordionTrigger>
          <div className='flex items-center gap-1'>
            <IconComponent size={16} />
            <p>{title}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {dependencies.length > 0 ? (
            <div className='flex flex-col gap-2 px-4 pt-4 border-t'>
              {dependencies.map((dependency, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between w-full'
                >
                  <div className='items-center flex gap-2'>
                    <CheckCircle size={14} className='text-emerald-500' />
                    <p>{dependency.name}</p>
                  </div>
                  <p className='font-mono text-xs text-muted-foreground'>
                    {dependencyTypeConfig[dependency.type || 'dependency']}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='px-4 pt-4 flex items-center justify-center'>
              <span className='font-mono text-xs text-muted-foreground'>
                Nenhuma dependência neste campo.
              </span>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
