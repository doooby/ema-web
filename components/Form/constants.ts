import { PropType } from 'vue';
import { FormField, FormValues } from './types';

export const FIELD_PROPS = {
  domId: { type: String, required: true },
  record: { type: Object as any, default: null },
  field: { type: Object as PropType<FormField>, required: true },
  formValues: { type: Object as PropType<FormValues>, required: true },
};
