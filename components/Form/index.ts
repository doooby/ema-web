import { formatISO } from 'date-fns';
import View from './View.vue';
import { FormField2, FormValues } from './types';

export {
  FormField2,
  FormValues,
};

export function createFormModel (fields?: FormField2[], record?: any): FormValues {
  const model = {} as FormValues;
  if (fields) {
    if (!record) record = {};
    for (const [ name ] of fields) {
      model[name] = record[name];
    }
  }
  return Object.freeze(model);
}

export function formToRecordParams (fields: FormField2[], values: FormValues): FormValues {
  const params = {} as FormValues;
  for (const [ name, control, opts ] of fields) {
    switch (control) {
      case 'calendar':
      case 'date': {
        const date = values[name];
        params[name] = date ? formatISO(date, { representation: 'date' }) : '';
        continue;
      }
      case 'integer':
      case 'text':
        params[name] = values[name] || '';
        continue;
      case 'assoc':
        params[(opts as any)?.paramsName || `${name}_id`] = values[name]?.id;
        continue;
      case 'custom':
        params[name] = values[name] || null;
        continue;
      default:
        utils.raise(new Error(`Form: field ${name} ${control} cannot be mapped to param`));
    }
  }
  return params;
}

export {
  View,
};
