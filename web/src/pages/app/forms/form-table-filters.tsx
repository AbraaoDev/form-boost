import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formFilterSchema = z.object({
  name: z.string().optional(),
  order: z.string(),
});

type FormFilterSchema = z.infer<typeof formFilterSchema>;

export function FormTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get('name');
  const order = searchParams.get('order');

  const { register, handleSubmit, control, reset } = useForm<FormFilterSchema>({
    resolver: zodResolver(formFilterSchema),
    defaultValues: {
      order: order ?? '',
      name: name ?? '',
    },
  });

  function handleFilter({ order, name }: FormFilterSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set('name', name);
      } else {
        state.delete('name');
      }

      if (order) {
        state.set('order', order);
      } else {
        state.delete('order');
      }

      state.set('page', '1');

      return state;
    });
  }

  function handleClearFilter() {
    setSearchParams((state) => {
      state.delete('order');
      state.delete('name');
      state.delete('page', '1');

      return state;
    });
    reset({
      order: '',
      name: '',
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className='flex items-center gap-2'
    >
      <Input
        placeholder='Pesquise por algum formulário'
        className='h-8 w-[320px]'
        {...register('name')}
      />

      <Controller
        name='order'
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              name={name}
              onValueChange={onChange}
              disabled={disabled}
              value={value as string}
            >
              <SelectTrigger className='h-8 w-[180px]'>
                <SelectValue placeholder='Selecionar ordem' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='desc'>Decrescente</SelectItem>
                <SelectItem value='asc'>Crescente</SelectItem>
              </SelectContent>
            </Select>
          );
        }}
      />

      <Button type='submit' variant='secondary'>
        <Search className='h-4 w-4 mr-2' />
        Filtrar resultados
      </Button>

      <Button
        type='button'
        variant='outline'
        onClick={() => handleClearFilter()}
      >
        <X className='h-4 w-4 mr-2' />
        Remover filtros
      </Button>
    </form>
  );
}
