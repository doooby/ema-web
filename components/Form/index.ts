import View from './View.vue';
import Vue from 'vue';
import { getControlType } from './controls';

interface FieldOptions {
  [option: string]: any;
}

// eslint-disable-next-line no-use-before-define
export type FormFieldDefinition = [ string, (string | FormFieldType), FieldOptions? ];

export interface FormField {
  name: string;
  // eslint-disable-next-line no-use-before-define
  type: FormFieldType;
  options: FieldOptions;
}

export interface FormFieldType {
  name: string;
  control: any;
  // eslint-disable-next-line no-use-before-define
  mapToValues(field: FormField, record: any, values: FormValues): FormValues;
  // eslint-disable-next-line no-use-before-define
  mapToRecord(field: FormField, values: FormValues, record: any): any;
}

export interface FormValues {
  [field: string]: any;
}

export interface FormGroupContext {
  namePrefix(name: string): string,
  fieldLabelKey(name: string): string,
  field(name: string): undefined | FormField;
  onChange(changes: FormValues): void;
}

export const FIELD_PROPS = {
  // @ts-ignore
  field: { type: Array as Vue.PropType<FormField>, required: true },
  context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
  formValues: { type: Object as Vue.PropType<FormValues>, required: true },
};

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
  return changedFormValues(values);
}

export function changedFormValues (values: FormValues): FormValues {
  return Object.freeze(values);
}

export function formToRecordParams (fields: FormField[], values: FormValues): FormValues {
  const params = {} as FormValues;
  for (const field of fields) {
    field.type.mapToRecord(field, values, params);
  }
  return params;
}

export {
  View,
};
