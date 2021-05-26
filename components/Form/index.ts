import { PropType } from 'vue';

export interface FormField {
  name: string;
  controlType: 'text';
}

export interface FormValues {
  [field: string]: any;
}

export function defineFormFields (...fields: FormField[]): Readonly<FormField[]> {
  // prevent name duplications
  const index: { [name: string]: FormField } = {};
  for (const field of fields) index[field.name] = Object.freeze(field);
  return Object.freeze(Object.values(index));
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

export const FIELD_PROPS = {
  domId: {
    type: String,
    required: true,
  },
  field: {
    type: Object as PropType<FormField>,
    required: true,
  },
  formValues: {
    type: Object as PropType<FormValues>,
    required: true,
  },
};
