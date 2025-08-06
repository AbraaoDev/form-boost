import { LoginForm } from './login-form';

export function Login() {
  return (
    <div className='p-8'>
      <div className='w-[350px] flex flex-col justify-center gap-6'>
        <div className='flex flex-col gap-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Acessar plataforma
          </h1>
          <p className='text-sm text-muted-foreground'>
            Crie seus formulários de forma inteligente.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
