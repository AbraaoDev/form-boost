import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CornerDownLeft, Edit, Ellipsis, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { deleteForm } from '@/http/delete-form';
import type { GetFormsResponse } from '@/http/get-forms';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type ActionMenuProps = {
  formId: string;
};

export function ActionMenu({ formId }: ActionMenuProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteFormFn } = useMutation({
    mutationFn: deleteForm,
    async onSuccess(_, { formId }) {
      const formsListCache = queryClient.getQueriesData<GetFormsResponse>({
        queryKey: ['forms'],
      });

      formsListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) {
          return;
        }
        queryClient.setQueryData<GetFormsResponse>(cacheKey, {
          ...cacheData,
          forms: cacheData.forms.filter((form) => form.id !== formId),
        });
      });
      toast.success('Formulário removido com sucesso');
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='xs'>
          <Ellipsis className='h-3 w-3' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <button className='w-full opacity-50' disabled>
              <CornerDownLeft className='mr-2 h-4 w-4' />
              <span>Responder</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button className='w-full opacity-50' disabled>
              <Edit className='mr-2 h-4 w-4' />
              <span>Editar</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button className='w-full cursor-pointer' onClick={() => deleteFormFn({ formId })}>
              <Trash className='mr-2 h-4 w-4 text-rose-500' />
              <span className='text-rose-500'>Excluir</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
