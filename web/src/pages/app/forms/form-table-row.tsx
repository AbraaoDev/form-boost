import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { ActionMenu } from '@/components/action-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { FormDetail } from './form-detail';

export interface FormTableRowProps {
  form: {
    id: string;
    name: string;
    schema_version: number;
    createdAt: string;
    isActive?: boolean;
    deletedAt?: string;
    userDeleted?: string;
  };
}

export function FormTableRow({ form }: FormTableRowProps) {
  // controller component, para não fazer requisições do dialog automaticamente (padrão)
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogTrigger asChild>
            <Button variant='ghost' size='xs'>
              <Eye className='h-3 w-3' />
              <span className='sr-only'>Ver formulário</span>
            </Button>
          </DialogTrigger>

          <FormDetail formId={form.id} open={isDetailOpen} />
        </Dialog>
      </TableCell>
      <TableCell className='font-mono text-xs font-medium text-muted-foreground'>
        {form.id}
      </TableCell>
      <TableCell className='font-medium'>{form.name}</TableCell>
      <TableCell>
        <Badge variant='outline'>
          <span className='w-1 h-1 bg-emerald-500 rounded-full' />v
          {form.schema_version}.0
        </Badge>
      </TableCell>
      <TableCell className='text-muted-foreground'>
        {formatDistanceToNow(form.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <ActionMenu formId={form.id} />
      </TableCell>
    </TableRow>
  );
}
