type FormData = {
  name: string
  description: string
  fields: []
}

type FieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'date'
  | 'calculated';