import {
  Calendar1,
  DecimalsArrowRight,
  Sigma,
  TextCursor,
  TextSelect,
  ToggleLeft,
} from 'lucide-react';
import { TableCell } from '@/components/ui/table';

type TypeFieldProps = {
  type: 'text' | 'number' | 'boolean' | 'select' | 'date' | 'calculated';
};

const typeConfig = {
  text: {
    icon: TextCursor,
    label: 'Texto',
  },
  number: {
    icon: DecimalsArrowRight,
    label: 'Número',
  },
  boolean: {
    icon: ToggleLeft,
    label: 'Booleano',
  },
  select: {
    icon: TextSelect,
    label: 'Seleção',
  },
  date: {
    icon: Calendar1,
    label: 'Data',
  },
  calculated: {
    icon: Sigma,
    label: 'Calculado',
  },
} as const;

export function TypeField({ type }: TypeFieldProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <TableCell className='flex items-center gap-1'>
      <IconComponent className='size-4' />
      {config.label}
    </TableCell>
  );
}
