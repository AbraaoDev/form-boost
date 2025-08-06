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
import { Badge } from '@/components/ui/badge';
import type { FieldType } from '@/types/form';

type FieldDragButtonProps = {
  type: FieldType;
  draggableId?: string;
  index?: number;
  className?: string;
  disabled?: boolean;
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
  disabled = false,
}: FieldDragButtonProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;
  const isCalculated = type === 'calculated';

  return (
    <Draggable draggableId={draggableId} index={index} isDragDisabled={disabled}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div
            className={`w-6 h-full bg-muted/50 flex items-center justify-center transition-all rounded-l ${disabled ? 'cursor-not-allowed' : 'hover:brightness-125 cursor-grab'
              }`}
            {...provided.dragHandleProps}
          >
            <GripVertical size={14} />
          </div>

          <div className={`flex-1 flex flex-col items-center justify-center gap-3 px-4 transition-all border-l relative ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-muted/80'
            }`}>
            <IconComponent size={20} />
            <p className='text-sm font-medium'>{config.label}</p>

            {isCalculated && (
              <Badge variant="default" className="absolute bottom-1 text-xs bg-orange-100 text-orange-500 ">
                Em breve
              </Badge>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
