import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getFormById, isCalculatedField } from '@/http/get-form-by-id';
import { TypeField } from './type-field';

export interface FormDetailProps {
  formId: string;
  open: boolean;
}

export function FormDetail({ formId, open }: FormDetailProps) {
  const { data: form } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => getFormById({ formId }),
    enabled: open,
  });

  if (!form) {
    return null;
  }
  return (
    <DialogContent className='sm:max-w-2xl'>
      <DialogHeader>
        <DialogTitle>{form.name}</DialogTitle>
        <DialogDescription>{form.description}</DialogDescription>
      </DialogHeader>
      <div className='space-y-6'>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className='text-muted-foreground'>Versão</TableCell>
              <TableCell className='flex justify-end'>
                <Badge variant='outline'>
                  <span className='w-1 h-1 bg-emerald-500 rounded-full' />v
                  {form.schema_version}.0
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table>
          <TableHeader className='bg-muted'>
            <TableRow>
              <TableHead>Campo</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.fields.map((field) => {
              return (
                <TableRow key={field.id}>
                  <TableCell className='text-muted-foreground'>
                    <div className='flex items-center justify-between'>
                      {field.label}
                      {isCalculatedField(field) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant='secondary'
                              className='text-xs font-mono text-muted-foreground max-w-[180px]'
                            >
                              <p className='truncate'>
                                Dependência{` -> `}
                                {field.dependencies
                                  ?.map(
                                    (dep) =>
                                      dep.charAt(0).toUpperCase() +
                                      dep.slice(1).toLowerCase(),
                                  )
                                  .join(', ')}
                              </p>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{field.dependencies?.join(', ')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TypeField type={field.type} />
                </TableRow>
              );
            })}
            {/* <TableRow>
              <TableCell className='text-muted-foreground'>Idade</TableCell>
              <TypeField type='number' />
            </TableRow>
            <TableRow>
              <TableCell className='text-muted-foreground'>
                <div className='flex items-center justify-between'>
                  Aceitar os termos
                  <Badge
                    variant='secondary'
                    className='text-xs font-mono text-muted-foreground max-w-[180px]'
                  >
                    <p className='truncate'>Condição{' -> idade >= 18'}</p>
                  </Badge>
                </div>
              </TableCell>
              <TypeField type='boolean' />
            </TableRow> */}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}
