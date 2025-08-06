import { RegisterForm } from './register-form';

export function Register() {
  return (
    <div className='p-8'>
      <div className='w-[350px] flex flex-col justify-center gap-6'>
        <div className='flex flex-col gap-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Fazer cadastro
          </h1>
          <p className='text-sm text-muted-foreground'>
            Insira os dados abaixos necessários para seu cadastro.
          </p>
        </div>
        <RegisterForm />
        <p className='px-6 text-center text-sm leading-relaxed text-muted-foreground'>
          Ao continuar, você concorda com nossos{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            Termos de serviço
          </a>{' '}
          e{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            Políticas de privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
