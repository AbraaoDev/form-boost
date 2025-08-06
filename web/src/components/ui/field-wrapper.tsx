import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
  className?: string;
  error?: FieldError;
};

export function FieldWrapper({
  label,
  children,
  className,
  error,
}: FieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor='title'>{label}</Label>
      {children}
      {error && <p className='text-red-500 text-sm'>{error.message}</p>}
    </div>
  );
}
