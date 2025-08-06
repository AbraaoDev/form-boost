import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  pages: number;
  lengthPage: number;
  onPageChange: (pageIndex: number) => Promise<void> | void;
  onLengthPageChange: (lengthPage: number) => void;
}

export function Pagination({
  pageIndex,
  pages,
  totalCount,
  lengthPage,
  onPageChange,
  onLengthPageChange,
}: PaginationProps) {
  return (
    <div className='flex items-center justify-between'>
      <span className='text-sm text-muted-foreground'>
        Total de {totalCount} form(s)
      </span>
      <div className='flex items-center gap-6 lg:gap-8'>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>Linhas por página</span>

          <Select
            value={String(lengthPage)}
            onValueChange={(value) => onLengthPageChange(Number(value))}
          >
            <SelectTrigger aria-label='Page' className='w-[80px]'>
              <SelectValue placeholder='Selecione' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>1</SelectItem>
              <SelectItem value='2'>2</SelectItem>
              <SelectItem value='3'>3</SelectItem>
              <SelectItem value='10'>10</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='text-sm font-medium'>
          Página {pageIndex} de {pages}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageChange(1)}
            disabled={pageIndex === 1}
          >
            <ChevronsLeft className='h-4 w-4' />
            <span className='sr-only'>Primeira página</span>
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 1}
          >
            <ChevronLeft className='h-4 w-4' />
            <span className='sr-only'>Página anterior</span>
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex === pages}
          >
            <ChevronRight className='h-4 w-4' />
            <span className='sr-only'>Próxima página</span>
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageChange(pages)}
            disabled={pageIndex === pages}
          >
            <ChevronsRight className='h-4 w-4' />
            <span className='sr-only'>Última página</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
