import View from './View.vue';
import Vue from 'vue';
import { getControlType } from './controls';

interface FormFieldOptions {
  label?: string | (() => string);
}

export type FormField = [ string, string, FormFieldOptions? ];

export interface FormValues {
  [field: string]: any;
}

export interface FormGroupContext {
  namePrefix(name: string): string,
  fieldLabelKey(name: string): string,
  field(name: string): undefined | FormField;
  onChange(changes: FormValues): void;
}

// export const FIELD_PROPS = {
//   domId: { type: String, required: true },
//   label: { type: String, default: '' },
//   record: { type: Object as any, default: null },
//   // @ts-ignore
//   field: { type: Array as Vue.PropType<FormField>, required: true },
//   formValues: { type: Object as Vue.PropType<FormValues>, required: true },
// };

export const FIELD_PROPS2 = {
  // @ts-ignore
  field: { type: Array as Vue.PropType<FormField>, required: true },
  context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
  formValues: { type: Object as Vue.PropType<FormValues>, required: true },
};

export function prefilledFormValues (fields: FormField[], record: any = {}): FormValues {
  const values = {} as FormValues;
  for (const field of fields) {
    getControlType(field)?.mapValues(field, record, values);
  }
  return changedFormValues(values);
}

export function changedFormValues (values: FormValues): FormValues {
  return Object.freeze(values);
}

export function formToRecordParams (fields: FormField[], values: FormValues): FormValues {
  const params = {} as FormValues;
  for (const field of fields) {
    getControlType(field)?.mapRecord(field, values, params);
  }
  // for (const [ name, control, opts ] of fields) {
  //   switch (control) {
  //     case 'calendar':
  //     case 'date': {
  //       const date = values[name];
  //       params[name] = date ? formatISO(date, { representation: 'date' }) : '';
  //       break;
  //     }
  //     case 'integer': {
  //       const value = values[name];
  //       params[name] = isNaN(value) ? '' : value;
  //       break;
  //     }
  //     case 'text':
  //     case 'textMultiline':
  //     case 'selectMultiple':
  //       params[name] = values[name] || '';
  //       break;
  //     case 'list': {
  //       const value = values[name];
  //       params[name] = value === undefined ? '' : value;
  //       break;
  //     }
  //     case 'assoc':
  //     case 'associatedRecord':
  //       params[(opts as any)?.paramsName || `${name}_id`] = values[name]?.id;
  //       break;
  //     case 'custom':
  //       params[name] = values[name];
  //       break;
  //     default:
  //       utils.raise(new Error(`Form: field ${name} ${control} cannot be mapped to param`));
  //   }
  // }
  return params;
}

export {
  View,
};
