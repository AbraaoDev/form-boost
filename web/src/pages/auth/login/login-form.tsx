import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { login } from '@/http/login';

const loginSchema = z.object({
  email: z.email({ message: 'Insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'Insira uma senha válida' }),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: login,
  });

  async function handleLogin({ email, password }: LoginForm) {
    try {
      await authenticate({ email, password });
      toast.success('Login feito com sucesso.');
      await navigate('/');
    } catch {
      toast.error('Credenciais inválidas.');
    }
  }
  return (
    <form onSubmit={handleSubmit(handleLogin)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>E-mail</Label>
        <Input
          id='email'
          placeholder='Digite seu e-mail'
          {...register('email')}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Senha</Label>
        <Input
          id='password'
          type='password'
          placeholder='Digite sua senha'
          {...register('password')}
        />
      </div>
      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : 'Acessar'}
      </Button>

      <Separator />
      <Button
        className='w-full'
        variant='outline'
        type='button'
        onClick={() => navigate('/register')}
      >
        Cadastrar-se
      </Button>
    </form>
  );
}
