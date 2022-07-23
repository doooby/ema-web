import { FormFieldType } from '~/components/Form';

import AssociatedRecordComponent from './AssociatedRecord/index.vue';
import MultipleAssociatedRecordsComponent from './MultipleAssociatedRecords/index.vue';
import NameControl, { type as NameType } from './Name.vue';

function make (control: any, type: any) {
  return { ...type, control };
}

export function asControl (component: any): FormFieldType {
  return { ...component.fieldType, control: component };
}

const AssociatedRecord = asControl(AssociatedRecordComponent);
const MultipleAssociatedRecords = asControl(MultipleAssociatedRecordsComponent);
const Name = make(NameControl, NameType);

export {
  AssociatedRecord,
  MultipleAssociatedRecords,
  Name,
};
