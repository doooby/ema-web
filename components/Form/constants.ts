import { PropType } from 'vue';
import { FormField2, FormValues } from './types';

export const FIELD_PROPS = {
  domId: { type: String, required: true },
  label: { type: String, default: '' },
  record: { type: Object as any, default: null },
  // @ts-ignore
  field: { type: Array as PropType<FormField2>, required: true },
  formValues: { type: Object as PropType<FormValues>, required: true },
};
