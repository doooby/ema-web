type Control =
  'text'
  | { type: 'assoc', name?: string, entity: string, getText?:(record: any) => string }
  ;

export interface FormField {
  name: string;
  caption?: string;
  control: Control;
}

export interface FormValues {
  [field: string]: any;
}
