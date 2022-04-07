import { controlsIndex, voidFieldType } from './controls';
import Group from './Group.vue';

export {
  Group as FormGroup,
};

interface FieldOptions {
  [option: string]: any;
}

export type FormFieldDefinition = [ string, (string | FormFieldType), FieldOptions? ];

export interface FormValues {
  [field: string]: any;
}

export interface FormField {
  name: string;
  type: FormFieldType;
  options: FieldOptions;
}

export interface FormFieldType {
  name?: string;
  control?: any;
  fillValues?(field: FormField, record: any, values: FormValues): void;
  fillParams(field: FormField, values: FormValues, record: any): any;
}

export interface FormGroupContext {
  namePrefix(name: string): string,
  fieldLabelKey(name: string): string,
  field(name: string): undefined | FormField;
  onChange(changes: FormValues): void;
}

function getControlType (type: string | FormFieldType): FormFieldType {
  const typeOfType = typeof type;
  if (typeOfType === 'object') {
    const customType = type as FormFieldType;
    if (!customType.control) {
      utils.warn('Form controls - custom type is missing control component', customType);
    }
    return customType;
  }
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

function defaultFillValuesUsingField ({ name }: FormField, record: any, values: FormValues): void {
  values[name] = record[name] ?? undefined;
}

export function prefillFormValues (fields: FormField[], record: any = {}): FormValues {
  const values = {} as FormValues;
  for (const field of fields) {
    (field.type.fillValues ?? defaultFillValuesUsingField)(field, record, values);
  }
  return values;
}

export function formToRecordParams (fields: FormField[], values: FormValues): FormValues {
  const params = {} as FormValues;
  for (const field of fields) {
    field.type.fillParams(field, values, params);
  }
  return params;
}
