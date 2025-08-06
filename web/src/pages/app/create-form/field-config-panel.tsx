import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Plus, CalendarIcon } from 'lucide-react';
import {
  Calendar1,
  DecimalsArrowRight,
  Sigma,
  TextCursor,
  TextSelect,
  ToggleLeft,
} from 'lucide-react';
import { InputField } from '@/components/ui/input/input-field';
import type { Field, SelectField, CalculatedField } from '@/types/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';


type FieldConfigPanelProps = {
  field: Field;
  onSave: (field: Field) => void;
  onCancel: () => void;
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

export function FieldConfigPanel({ field, onSave, onCancel }: FieldConfigPanelProps) {
  const { control, handleSubmit, watch, setValue } = useForm<Field>({
    defaultValues: field
  });

  const watchedField = watch();
  const config = typeConfig[watchedField.type];
  const IconComponent = config.icon;

  const onSubmit = (data: Field) => {
    onSave(data);
  };

  const renderTextFieldConfig = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="ID"
            name="id"
            placeholder="campo_texto"
            control={control}
          />
          <InputField
            label="Label"
            name="label"
            placeholder="Nome do campo"
            control={control}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Obrigatório</Label>
          <Controller
            control={control}
            name="required"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Capitalizar</Label>
          <Controller
            control={control}
            name="capitalize"
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Multilinha</Label>
          <Controller
            control={control}
            name="multiline"
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <Separator />

        <InputField
          label="Expressão Condicional"
          name="conditional"
          placeholder="Ex: idade >= 18"
          control={control}
        />
      </div>
    );
  };

  const renderNumberFieldConfig = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="ID"
            name="id"
            placeholder="campo_numero"
            control={control}
          />
          <InputField
            label="Label"
            name="label"
            placeholder="Nome do campo"
            control={control}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor="format">Formato</Label>
          <Controller
            control={control}
            name="format"
            render={({ field }) => (
              <Select value={field.value || 'decimal'} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decimal">Decimal</SelectItem>
                  <SelectItem value="integer">Inteiro</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Obrigatório</Label>
          <Controller
            control={control}
            name="required"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <InputField
          label="Expressão Condicional"
          name="conditional"
          placeholder="Ex: idade >= 18"
          control={control}
        />
      </div>
    );
  };

  const renderBooleanFieldConfig = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="ID"
            name="id"
            placeholder="campo_booleano"
            control={control}
          />
          <InputField
            label="Label"
            name="label"
            placeholder="Nome do campo"
            control={control}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Obrigatório</Label>
          <Controller
            control={control}
            name="required"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <InputField
          label="Expressão Condicional"
          name="conditional"
          placeholder="Ex: idade >= 18"
          control={control}
        />
      </div>
    );
  };

  const renderDateFieldConfig = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="ID"
            name="id"
            placeholder="campo_data"
            control={control}
          />
          <InputField
            label="Label"
            name="label"
            placeholder="Nome do campo"
            control={control}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Obrigatório</Label>
          <Controller
            control={control}
            name="required"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className='space-y-2'>
            <Label htmlFor="min">Data Mínima</Label>
            <Controller
              control={control}
              name="min"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
                      ) : (
                        <span>Selecionar data mínima</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor="max">Data Máxima</Label>
            <Controller
              control={control}
              name="max"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
                      ) : (
                        <span>Selecionar data máxima</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>

        <InputField
          label="Expressão Condicional"
          name="conditional"
          placeholder="Ex: idade >= 18"
          control={control}
        />
      </div>
    );
  };

  const renderSelectFieldConfig = () => {
    const [newOption, setNewOption] = useState({ label: '', value: '' });
    const selectField = watchedField as SelectField;
    const options = selectField.options || [];

    const addOption = () => {
      if (newOption.label && newOption.value) {
        setValue('options', [...options, newOption]);
        setNewOption({ label: '', value: '' });
      }
    };

    const removeOption = (index: number) => {
      setValue('options', options.filter((_: any, i: number) => i !== index));
    };

    const updateOption = (index: number, field: 'label' | 'value', value: string) => {
      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setValue('options', newOptions);
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="ID"
            name="id"
            placeholder="campo_select"
            control={control}
          />
          <InputField
            label="Label"
            name="label"
            placeholder="Nome do campo"
            control={control}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Obrigatório</Label>
          <Controller
            control={control}
            name="required"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Múltipla Seleção</Label>
          <Controller
            control={control}
            name="multiple"
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <InputField
          label="Expressão Condicional"
          name="conditional"
          placeholder="Ex: idade >= 18"
          control={control}
        />

        <Separator />

        <div className='space-y-2'>
          <Label>Opções</Label>
          <div className="space-y-2">
            {options.map((option: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(index, 'label', e.target.value)}
                  placeholder="Label da opção"
                  className="flex-1 p-2 border rounded-md"
                />
                <Input
                  value={option.value}
                  onChange={(e) => updateOption(index, 'value', e.target.value)}
                  placeholder="Valor da opção"
                  className="flex-1 p-2 border rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className='h-9 w-9'
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newOption.label}
                onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Label da nova opção"
                className="flex-1 p-2 border rounded-md"
              />
              <Input
                value={newOption.value}
                onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Valor da nova opção"
                className="flex-1 p-2 border rounded-md"
              />
              <Button type="button" variant="outline" size="sm" onClick={addOption} className='h-9 w-9'>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalculatedFieldConfig = () => {
    const [newDependency, setNewDependency] = useState('');
    const calculatedField = watchedField as CalculatedField;
    const dependencies = calculatedField.dependencies || [];

    const addDependency = () => {
      if (newDependency) {
        setValue('dependencies', [...dependencies, newDependency]);
        setNewDependency('');
      }
    };

    const removeDependency = (index: number) => {
      setValue('dependencies', dependencies.filter((_: any, i: number) => i !== index));
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="ID"
            name="id"
            placeholder="campo_calculado"
            control={control}
          />
          <InputField
            label="Label"
            name="label"
            placeholder="Nome do campo"
            control={control}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Obrigatório</Label>
          <Controller
            control={control}
            name="required"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor="formula">Fórmula</Label>
          <Controller
            control={control}
            name="formula"
            render={({ field }) => (
              <Textarea
                id="formula"
                value={field.value}
                onChange={field.onChange}
                placeholder="Ex: valor1 + valor2 * 2"
                rows={3}
              />
            )}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor="precision">Precisão</Label>
          <Controller
            control={control}
            name="precision"
            render={({ field }) => (
              <Input
                id="precision"
                type="number"
                min="0"
                max="10"
                value={field.value || 2}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            )}
          />
        </div>

        <Separator />

        <div className='space-y-2'>
          <Label>Dependências</Label>
          <div className="space-y-2">
            <div className="flex flex-row items-cente gap-2">
              {dependencies.map((dep: any, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 pr-1">
                  <span>{dep}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDependency(index)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={newDependency}
                onChange={(e) => setNewDependency(e.target.value)}
                placeholder="Nome do campo dependente"
                className="flex-1 p-2 border rounded-md"
              />
              <Button type="button" variant="outline" size="sm" onClick={addDependency} className='h-9 w-9'>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConfigByType = () => {
    switch (watchedField.type) {
      case 'text':
        return renderTextFieldConfig();
      case 'number':
        return renderNumberFieldConfig();
      case 'boolean':
        return renderBooleanFieldConfig();
      case 'date':
        return renderDateFieldConfig();
      case 'select':
        return renderSelectFieldConfig();
      case 'calculated':
        return renderCalculatedFieldConfig();
      default:
        return <div>Configuração não disponível para este tipo de campo</div>;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className='bg-blue-50'>
        <span className='font-medium flex items-center gap-2'>
          <IconComponent size={18} className='text-muted-foreground' />
          {config.label}
        </span>
      </CardHeader>
      <CardContent className="space-y-6 mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderConfigByType()}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Campo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 