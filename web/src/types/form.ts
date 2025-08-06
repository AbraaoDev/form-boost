export type FieldType = 'text' | 'number' | 'boolean' | 'select' | 'date' | 'calculated';

export interface TextValidation {
  type: 'min_length' | 'max_length' | 'regex' | 'not_contain' | 'not_empty';
  value?: string | number | string[];
}

export interface NumberValidation {
  type: 'min' | 'max' | 'multiple_of' | 'format' | 'not_empty';
  value?: number | string;
}

export interface BooleanValidation {
  type: 'not_empty' | 'expected_value' | 'blocked_for_false';
  value?: boolean | string;
}

export interface DateValidation {
  type: 'future_date' | 'strict_iso_format' | 'not_empty' | 'before';
  value?: string | boolean;
  allowed?: boolean;
  field?: string;
}

export interface SelectValidation {
  type: 'in_list' | 'min_count' | 'max_count' | 'required_conditional';
  value?: number | string;
  min?: number;
  max?: number;
  conditional?: string;
}

export interface CalculatedValidation {
  type: 'in_list' | 'equal_to' | 'valid_range' | 'valid_date_format';
  value?: any;
  values?: any[];
  min?: number;
  max?: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface BaseField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  conditional?: string;
  validations?: any[];
}

export interface TextField extends BaseField {
  type: 'text';
  capitalize?: boolean;
  multiline?: boolean;
  validations?: TextValidation[];
}

export interface NumberField extends BaseField {
  type: 'number';
  format?: 'integer' | 'decimal';
  validations?: NumberValidation[];
}

export interface BooleanField extends BaseField {
  type: 'boolean';
  validations?: BooleanValidation[];
}

export interface DateField extends BaseField {
  type: 'date';
  min?: string;
  max?: string;
  validations?: DateValidation[];
}

export interface SelectField extends BaseField {
  type: 'select';
  multiple?: boolean;
  options: SelectOption[];
  validations?: SelectValidation[];
}

export interface CalculatedField extends BaseField {
  type: 'calculated';
  formula: string;
  dependencies: string[];
  precision?: number;
  validations?: CalculatedValidation[];
}

export type Field = TextField | NumberField | BooleanField | DateField | SelectField | CalculatedField;

export interface FormData {
  name: string;
  description?: string;
  fields: Field[];
} 