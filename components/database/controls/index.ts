import { asFieldType } from '~/components/Form';

import MultipleAssociatedRecordsComponent from './MultipleAssociatedRecords/index.vue';

export const asControl = asFieldType;

const MultipleAssociatedRecords = asControl(MultipleAssociatedRecordsComponent);

export {
  MultipleAssociatedRecords,
};
