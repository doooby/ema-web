import { PropType } from 'vue';
import { FormField, FormField2, FormValues } from './types';

export const FIELD_PROPS = {
  domId: { type: String, required: true },
  label: { type: String, default: '' },
  record: { type: Object as any, default: null },
  field: { type: Object as PropType<FormField | FormField2>, required: true },
  formValues: { type: Object as PropType<FormValues>, required: true },
};
