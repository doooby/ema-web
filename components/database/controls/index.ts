import { FormFieldType } from '~/components/Form';

import AssociatedRecordComponent from './AssociatedRecord/index.vue';
import MultipleAssociatedRecordsComponent from './MultipleAssociatedRecords/index.vue';

export function asControl (component: any): FormFieldType {
  return { ...component.fieldType, control: component };
}

const AssociatedRecord = asControl(AssociatedRecordComponent);
const MultipleAssociatedRecords = asControl(MultipleAssociatedRecordsComponent);

export {
  AssociatedRecord,
  MultipleAssociatedRecords,
};
