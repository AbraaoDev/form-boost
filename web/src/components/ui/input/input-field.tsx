import type { ComponentProps, ReactNode } from 'react';
import { type Control, Controller, useFormContext } from 'react-hook-form';
import { FieldWrapper } from '../field-wrapper';
import { Input } from './input';

type InputFieldProps = ComponentProps<typeof Input> & {
  label: string;
  name: string;
  containerClassName?: string;
  extraContent?: (value: string) => ReactNode;
  control?: Control<any, any>;
};

export function InputField({
  label,
  name,
  required,
  containerClassName,
  extraContent,
  control: customContol,
  ...props
}: InputFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={customContol ?? control}
      name={name}
      rules={{
        required: required && 'Campo obrigatório',
      }}
      render={({ field, fieldState }) => (
        <FieldWrapper
          label={label}
          className={containerClassName}
          error={fieldState?.error}
        >
          <Input {...props} {...field} />
          {extraContent && extraContent(field.value)}
        </FieldWrapper>
      )}
    />
  );
}
