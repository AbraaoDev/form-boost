import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { BasicInfoSection } from './basic-info-section';
import { DroppableForm } from './droppable-form';
import { FieldDragSection } from './field-drag-section';
import { MapCreateSection } from './map-create-section';
import type { Field, FieldType } from '@/types/form';

export function CreateFormPage() {
  const methods = useForm<FormData>();
  const [createdFields, setCreatedFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const handleFieldCreated = (field: Field) => {
    setCreatedFields(prev => [...prev, field]);
    setSelectedField(null);
  };

  const handleFieldDeleted = (fieldId: string) => {
    setCreatedFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'field-types-sidebar' && destination.droppableId === 'form-creation-area') {
      const draggedFieldType = result.draggableId.replace('sidebar-field-', '') as FieldType;

      const newField: Field = createDefaultField(draggedFieldType);
      setSelectedField(newField);
    }
  };

  const createDefaultField = (type: FieldType): Field => {
    const baseField = {
      id: `field_${Date.now()}`,
      label: `Campo ${type}`,
      required: false,
    };

    switch (type) {
      case 'text':
        return {
          ...baseField,
          type: 'text',
          capitalize: false,
          multiline: false,
        } as Field;
      case 'number':
        return {
          ...baseField,
          type: 'number',
          format: 'decimal',
        } as Field;
      case 'boolean':
        return {
          ...baseField,
          type: 'boolean',
        } as Field;
      case 'select':
        return {
          ...baseField,
          type: 'select',
          multiple: false,
          options: [
            { label: 'Opção 1', value: 'option1' },
            { label: 'Opção 2', value: 'option2' },
          ],
        } as Field;
      case 'date':
        return {
          ...baseField,
          type: 'date',
        } as Field;
      case 'calculated':
        return {
          ...baseField,
          type: 'calculated',
          formula: '',
          dependencies: [],
        } as Field;
      default:
        return baseField as Field;
    }
  };

  return (
    <FormProvider {...methods}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <main className='w-full h-screen overflow-hidden'>
          <ResizablePanelGroup direction='horizontal' className='w-full h-full'>
            <ResizablePanel minSize={20} maxSize={30} defaultSize={25}>
              <aside className='w-full h-full p-6 overflow-y-auto flex flex-col gap-6'>
                <BasicInfoSection />
                <Separator />
                <MapCreateSection fields={createdFields} />
              </aside>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <section className='overflow-hidden w-full h-full flex justify-center relative bg-muted p-6'>
                <DroppableForm
                  onFieldCreated={handleFieldCreated}
                  onFieldDeleted={handleFieldDeleted}
                  selectedField={selectedField}
                  onFieldSave={handleFieldCreated}
                  onFieldCancel={() => setSelectedField(null)}
                  createdFields={createdFields}
                />
              </section>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20} maxSize={35} defaultSize={25}>
              <section className='w-full h-full p-6 overflow-y-auto flex flex-col gap-6'>
                <FieldDragSection />
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </DragDropContext>
    </FormProvider>
  );
}
