import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import z from 'zod';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getForms } from '@/http/get-forms';
import { getProfile } from '@/http/get-profile';
import { FormTableFilters } from './form-table-filters';
import { FormTableRow } from './form-table-row';

export function Forms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1');
  const lengthPage = z.coerce
    .number()
    .parse(searchParams.get('lengthPage') ?? '10');
  const name = searchParams.get('name');
  const order = searchParams.get('order');

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
  });

  const { data: result } = useQuery({
    queryKey: ['forms', page, lengthPage, name, order],
    queryFn: () =>
      getForms({
        page,
        lengthPage,
        order,
        name,
      }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', pageIndex.toString());
      return state;
    });
  }

  function handleLengthPageChange(newLength: number) {
    setSearchParams((state) => {
      state.set('lengthPage', newLength.toString());
      state.set('page', '1');
      return state;
    });
  }

  return (
    <>
      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold tracking-tight flex items-center'>
          Olá,{' '}
          {isLoadingProfile ? (
            <Skeleton className='h-4 w-40' />
          ) : (
            profile?.user.name
          )}{' '}
          👋
        </h1>
        <p className='text-muted-foreground'>
          Abaixo estão listados os formulários criados e também para respostas.
        </p>
      </div>
      <div className='space-y-2.5 mt-4'>
        <div className='flex items-center justify-between'>
          <FormTableFilters />
          <Button onClick={() => navigate('/create-form')}>
            <Plus />
            Criar formulários
          </Button>
        </div>

        <div className='border rounded-md'>
          <Table>
            <TableHeader className='bg-muted'>
              <TableRow>
                <TableHead className='w-[64px]'></TableHead>
                <TableHead className='w-[200px]'>Identificador</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className='w-[80px]'>Versão</TableHead>
                <TableHead className='w-[200px]'>Criado em</TableHead>
                <TableHead className='w-[32px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result?.forms.map((form) => {
                return <FormTableRow key={form.id} form={form} />;
              })}
            </TableBody>
          </Table>
        </div>
        {result?.forms && (
          <Pagination
            onPageChange={handlePaginate}
            pageIndex={page}
            totalCount={result.total_itens}
            pages={result.total_pages}
            lengthPage={lengthPage}
            onLengthPageChange={handleLengthPageChange}
          />
        )}
      </div>
    </>
  );
}
