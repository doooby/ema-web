import { formatISO } from 'date-fns';
import View from './View.vue';
import { PropType } from 'vue';

interface FormFieldOptions {
  label?: string | (() => string);
}

export type FormField = [ string, string, FormFieldOptions? ];

export interface FormValues {
  [field: string]: any;
}

export const FIELD_PROPS = {
  domId: { type: String, required: true },
  label: { type: String, default: '' },
  record: { type: Object as any, default: null },
  // @ts-ignore
  field: { type: Array as PropType<FormField>, required: true },
  formValues: { type: Object as PropType<FormValues>, required: true },
};

export function createFormModel (fields?: FormField[], record?: any): FormValues {
  const model = {} as FormValues;
  if (fields) {
    if (!record) record = {};
    for (const [ name ] of fields) {
      model[name] = record[name];
    }
  }
  return Object.freeze(model);
}

export function formToRecordParams (fields: FormField[], values: FormValues): FormValues {
  const params = {} as FormValues;
  for (const [ name, control, opts ] of fields) {
    switch (control) {
      case 'calendar':
      case 'date': {
        const date = values[name];
        params[name] = date ? formatISO(date, { representation: 'date' }) : '';
        break;
      }
      case 'integer':
        params[name] = values[name];
        break;
      case 'text':
        params[name] = values[name] || '';
        break;
      case 'assoc':
      case 'associatedRecord':
        params[(opts as any)?.paramsName || `${name}_id`] = values[name]?.id;
        break;
      case 'custom':
        params[name] = values[name] || null;
        break;
      default:
        utils.raise(new Error(`Form: field ${name} ${control} cannot be mapped to param`));
    }
  }
  return params;
}

export {
  View,
};
