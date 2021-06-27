import View from './View.vue';
import { FormField, FormValues } from './types';

export {
  FormField,
  FormValues,
};

export function defineFormFields (fields: FormField[]): FormField[] {
  // prevent name duplications
  const index: { [name: string]: FormField } = {};
  for (const field of fields) index[field.name] = Object.freeze(field);
  return Object.freeze(Object.values(index)) as any;
}

export function createFormModel (fields?: FormField[], record?: any): FormValues {
  const model = {} as FormValues;
  if (fields) {
    if (!record) record = {};
    for (const field of fields) {
      model[field.name] = record[field.name];
    }
  }
  return Object.freeze(model);
}

export function formModelToRecordParams (fields: FormField[], values: FormValues): FormValues {
  const params = {} as FormValues;
  for (const { name, control } of fields) {
    if (typeof control === 'object') {
      switch (control.type) {
        case 'assoc':
          params[control.name || `${name}_id`] = values[name]?.id;
          continue;
      }
    }
    params[name] = values[name];
  }
  return params;
}

export function fieldCaptionGet (field: FormField): string {
  return field.caption || `form.field.${field.name}`;
}

export {
  View,
};
