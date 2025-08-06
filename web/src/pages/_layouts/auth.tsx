import { Outlet } from 'react-router-dom';
import Logo from '../../assets/logo.svg?react';

export function AuthLayout() {
  return (
    <div className='min-h-screen grid grid-cols-2'>
      <div className='h-full border-r border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between'>
        <div className='flex items-center gap-3'>
          <Logo className='w-40' />
        </div>
        <footer className='text-sm'>
          Sistema para criação de Formulários Inteligentes &copy; {' '}
          {new Date().getFullYear()}
        </footer>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <Outlet />
      </div>
    </div>
  );
}
