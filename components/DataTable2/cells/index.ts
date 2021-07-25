import AssociatedRecordCell from './AssociatedRecordCell.vue';
import RecordLinkCell from './RecordLinkCell.vue';

export const cellComponents: { [type: string]: any } = {
  assoc: AssociatedRecordCell,
  link: RecordLinkCell,
};
