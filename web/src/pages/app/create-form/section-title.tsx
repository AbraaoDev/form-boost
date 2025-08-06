import type { LucideIcon } from 'lucide-react';

type SectionTitleProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export function SectionTitle({
  icon: Icon,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className='flex items-center gap-2'>
      <div className='p-3 bg-secondary rounded-sm'>
        <Icon size={20} className='text-primary' />
      </div>
      <div className='flex flex-col'>
        <h3 className='font-semibold text-xl'>{title}</h3>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
    </div>
  );
}
