import View from './View.vue';
import { controlsIndex, voidFieldType } from './controls';

interface FieldOptions {
  [option: string]: any;
}

// eslint-disable-next-line no-use-before-define
export type FormFieldDefinition = [ string, (string | FormFieldType), FieldOptions? ];

export interface FormValues {
  [field: string]: any;
}

export interface FormField {
  name: string;
  // eslint-disable-next-line no-use-before-define
  type: FormFieldType;
  options: FieldOptions;
}

export interface FormFieldType {
  name: string;
  control: any;
  mapToValues(field: FormField, record: any, values: FormValues): FormValues;
  mapToRecordParams(field: FormField, values: FormValues, record: any): any;
}

export interface FormGroupContext {
  namePrefix(name: string): string,
  fieldLabelKey(name: string): string,
  field(name: string): undefined | FormField;
  onChange(changes: FormValues): void;
}

function getControlType (type: string | FormFieldType): FormFieldType {
  const typeOfType = typeof type;
  if (typeOfType === 'object') return type as FormFieldType;
  if (typeOfType === 'string') {
    const knownType = controlsIndex[type as string];
    if (knownType) return knownType;
  }

  utils.warn('Form controls - unknown type', type);
  return voidFieldType;
}

export function buildFormFields (fields: FormFieldDefinition[]): FormField[] {
  return fields.map(([ name, type, options ]) => ({
    name,
    type: getControlType(type),
    options: options || {},
  }));
}

export function prefilledFormValues (fields: FormField[], record: any = {}): FormValues {
  const values = {} as FormValues;
  for (const field of fields) {
    field.type.mapToValues(field, record, values);
  }
  return values;
}

export function formToRecordParams (fields: FormField[], values: FormValues): FormValues {
  const params = {} as FormValues;
  for (const field of fields) {
    field.type.mapToRecordParams(field, values, params);
  }
  return params;
}

export {
  View,
};
