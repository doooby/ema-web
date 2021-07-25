export interface AssociationControl {
  type: 'assoc';
  name?: string;
  entity: string;
}

type Control =
  'calendar'
  | 'date'
  | 'text'
  | AssociationControl
  ;

export interface FormField {
  name: string;
  caption?: string;
  control: Control;
}

export interface FormValues {
  [field: string]: any;
}
