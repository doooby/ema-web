import AssociatedRecordControl, { type as AssociatedRecordType } from './AssociatedRecord/index.vue';
import NameControl, { type as NameType } from './Name.vue';

function make (type: any, control: any) {
  return { ...type, control };
}

const AssociatedRecord = make(AssociatedRecordType, AssociatedRecordControl);
const Name = make(NameType, NameControl);

export {
  AssociatedRecord,
  Name,
};
