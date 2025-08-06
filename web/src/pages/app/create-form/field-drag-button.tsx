import { Draggable } from '@hello-pangea/dnd';
import {
  Calendar1,
  DecimalsArrowRight,
  GripVertical,
  Sigma,
  TextCursor,
  TextSelect,
  ToggleLeft,
} from 'lucide-react';
import type { FieldType } from '@/types/form';

type FieldDragButtonProps = {
  type: FieldType;
  draggableId?: string;
  index?: number;
  className?: string;
};

const typeConfig = {
  text: {
    icon: TextCursor,
    label: 'Texto',
  },
  number: {
    icon: DecimalsArrowRight,
    label: 'Numérico',
  },
  boolean: {
    icon: ToggleLeft,
    label: 'Booleano',
  },
  select: {
    icon: TextSelect,
    label: 'Select',
  },
  date: {
    icon: Calendar1,
    label: 'Data',
  },
  calculated: {
    icon: Sigma,
    label: 'Calculated',
  },
} as const;

export function FieldDragButton({
  type,
  draggableId = `sidebar-field-${type}`,
  index = 0,
  className = 'h-24 w-full bg-muted/50 flex rounded border ',
}: FieldDragButtonProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={className}
        >
          <div
            className='w-6 h-full bg-muted/50 flex items-center justify-center hover:brightness-125 transition-all rounded-l'
            {...provided.dragHandleProps}
          >
            <GripVertical size={14} />
          </div>

          <div className='flex-1 flex flex-col items-center justify-center gap-3 px-4 cursor-pointer hover:bg-muted/80 transition-all border-l'>
            <IconComponent size={20} />
            <p className='text-sm font-medium'>{config.label}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
}
