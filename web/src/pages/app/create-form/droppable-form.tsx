import { Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';
import Logo from '@/assets/logo-icon.svg?react';
import type { Field } from '@/types/form';
import { FieldConfigPanel } from './field-config-panel';

type DroppableFormProps = {
  onFieldCreated?: (field: Field) => void;
  onFieldDeleted?: (fieldId: string) => void;
  selectedField?: Field | null;
  onFieldSave?: (field: Field) => void;
  onFieldCancel?: () => void;
  createdFields?: Field[];
};

export function DroppableForm({
  onFieldCreated,
  onFieldDeleted,
  selectedField,
  onFieldSave,
  onFieldCancel,
  createdFields = []
}: DroppableFormProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFieldSave = (field: Field) => {
    onFieldSave?.(field);
  };

  const handleFieldCancel = () => {
    onFieldCancel?.();
  };

  const handleDeleteField = (fieldId: string) => {
    onFieldDeleted?.(fieldId);
  };

  return (
    <Droppable droppableId="form-creation-area">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`w-full h-full flex flex-col gap-6 items-center justify-center transition-all duration-300 ease-in-out ${snapshot.isDraggingOver || isDragOver
            ? 'bg-emerald-50/80 border-2 border-emerald-200 border-dashed scale-[1.02]'
            : 'bg-muted'
            } rounded-lg p-8`}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {selectedField ? (
            <FieldConfigPanel
              field={selectedField}
              onSave={handleFieldSave}
              onCancel={handleFieldCancel}
            />
          ) : createdFields.length === 0 ? (
            <>
              <Logo className='h-16 w-16' />
              <h4 className={`text-center font-medium transition-colors duration-300 ${snapshot.isDraggingOver || isDragOver
                ? 'text-emerald-700'
                : 'text-muted-foreground'
                }`}>
                {snapshot.isDraggingOver || isDragOver
                  ? 'Solte o campo aqui para configurá-lo!'
                  : 'Área de criação, coloque um campo aqui e veja a mágica acontecer.'}
              </h4>
            </>
          ) : (
            <div className="w-full">
              <h4 className="text-center font-medium text-muted-foreground mb-4">
                Campos criados: {createdFields.length}
              </h4>
              <div className="space-y-2">
                {createdFields.map((field, index) => (
                  <div key={field.id} className="p-3 bg-background border rounded-md flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{field.label}</span>
                      <span className="text-xs text-muted-foreground">({field.type})</span>
                    </div>
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                      title="Remover campo"
                    >
                      <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
