export interface AssociationControl {
  type: 'assoc',
  name?: string,
  entity: string,
  getText?:(record: any) => string,
}

type Control =
  'text'
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
