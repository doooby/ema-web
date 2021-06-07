import { PropType } from 'vue';
import { FormField, FormValues } from '.';

export const FIELD_PROPS = {
  domId: { type: String, required: true },
  field: { type: Object as PropType<FormField>, required: true },
  formValues: { type: Object as PropType<FormValues>, required: true },
};
