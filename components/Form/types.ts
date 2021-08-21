export interface AssociationControl {
  type: 'assoc';
  name?: string;
  entity: string;
}

type Control =
  'calendar'
  | 'date'
  | 'integer'
  | 'text'
  | AssociationControl
  | { type: 'custom', component: any }
  ;

export interface FormField {
  name: string;
  caption?: string;
  control: Control;
  labels?: { [name: string]: string };
  data?: any;
}

interface FormFieldOptions {
  label?: string | (() => string);
}

export type FormField2 = [ string, string, FormFieldOptions? ];

export interface FormValues {
  [field: string]: any;
}
