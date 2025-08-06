import { HammerIcon, Home } from 'lucide-react';
import LogoIcon from '@/assets/logo-icon.svg?react';

import { AccountMenu } from './account-menu';
import { NavLink } from './nav-link';
import { Separator } from './ui/separator';

export function Header() {
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center gap-6 px-6'>
        <LogoIcon className='w-6' />

        <Separator orientation='vertical' className='h-6' />

        <nav className='flex items-center space-x-4 lg:space-x-6'>
          <NavLink to='/'>
            <Home className='h-4 w-4' />
            Início
          </NavLink>
        </nav>

        <div className='ml-auto flex items-center space-x-2'>
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
