import { api } from "@/lib/axios";


export interface FieldValidation {
  type: string;
  value?: any;
  message?: string;
}

interface BaseField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}


export interface TextField extends BaseField {
  type: 'text';
  capitalize?: boolean;
  multiline?: boolean;
  validations?: FieldValidation[];
}

export interface NumberField extends BaseField {
  type: 'number';
  format?: string;
  validations?: FieldValidation[];
}

export interface BooleanField extends BaseField {
  type: 'boolean';
  validations?: FieldValidation[];
}

export interface DateField extends BaseField {
  type: 'date';
  min?: string;
  max?: string;
  validations?: FieldValidation[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectField extends BaseField {
  type: 'select';
  multiple?: boolean;
  options?: SelectOption[];
  validations?: FieldValidation[];
}

export interface CalculatedField extends BaseField {
  type: 'calculated';
  formula?: string;
  dependencies?: string[];
  precision?: number;
  validations?: FieldValidation[];
}

export type FormField = 
  | TextField 
  | NumberField 
  | BooleanField 
  | DateField 
  | SelectField 
  | CalculatedField;


export interface GetFormByIdParams {
  formId: string;
}

export interface GetFormByIdResponse {
  id: string;
  name: string;
  description?: string;
  schema_version: number;
  created_at: string;
  fields: FormField[];
}

export function isTextField(field: FormField): field is TextField {
  return field.type === 'text';
}

export function isNumberField(field: FormField): field is NumberField {
  return field.type === 'number';
}

export function isSelectField(field: FormField): field is SelectField {
  return field.type === 'select';
}

export function isCalculatedField(field: FormField): field is CalculatedField {
  return field.type === 'calculated';
}

export function isDateField(field: FormField): field is DateField {
  return field.type === 'date';
}

export function isBooleanField(field: FormField): field is BooleanField {
  return field.type === 'boolean';
}

export async function getFormById({formId} : GetFormByIdParams){
 const response = await api.get<GetFormByIdResponse>(`/forms/${formId}`) 
 return response.data
}


