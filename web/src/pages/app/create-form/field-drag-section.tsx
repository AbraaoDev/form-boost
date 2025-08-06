import { Droppable } from '@hello-pangea/dnd';
import { Hand } from 'lucide-react';
import { FieldDragButton } from './field-drag-button';
import { SectionTitle } from './section-title';
import type { FieldType } from '@/types/form';

export function FieldDragSection() {
  const fieldTypes: FieldType[] = [
    'text',
    'number',
    'boolean',
    'select',
    'date',
    'calculated',
  ];

  return (
    <div>
      <SectionTitle
        icon={Hand}
        title='Campos'
        description='Arraste e solte os campos na área de criação.'
      />
      <Droppable droppableId='field-types-sidebar' isDropDisabled={true}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-2 gap-4 mt-6 w-full ${snapshot.isDraggingOver ? 'bg-muted/20' : ''
              } transition-colors`}
          >
            {fieldTypes.map((type, index) => (
              <FieldDragButton
                key={type}
                type={type}
                draggableId={`sidebar-field-${type}`}
                index={index}
                disabled={type === 'calculated'}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
