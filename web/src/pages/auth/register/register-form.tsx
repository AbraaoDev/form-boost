import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/http/register';

const registerSchema = z.object({
  name: z.string({ message: 'Insira seu nome completo' }),
  email: z.email({ message: 'Insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'Insira uma senha válida' }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterForm>();

  const { mutateAsync: registerUserFn } = useMutation({
    mutationFn: registerUser,
  });

  async function handleRegister({ name, email, password }: RegisterForm) {
    try {
      await registerUserFn({ name, email, password });
      toast.success('Cadastro feito com sucesso.', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/login?email=${email}`),
        },
      });
    } catch {
      toast.error('Erro ao cadastrar.');
    }
  }
  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Nome completo</Label>
          <Input
            id='name'
            type='text'
            autoCorrect='off'
            placeholder='Digite seu nome'
            {...register('name')}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Seu e-mail</Label>
          <Input
            id='email'
            type='email'
            autoCapitalize='none'
            autoComplete='email'
            autoCorrect='off'
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

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          Finalizar cadastro
        </Button>
      </div>
    </form>
  );
}
