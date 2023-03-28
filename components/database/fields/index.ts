import SelectBRecord from '~/components/database/fields/SelectBRecord.vue';
import { asFieldType } from '~/components/Form';
import SelectManyBRecords from '~/components/database/fields/SelectManyBRecords.vue';

export const dbFields = {
  selectBRecord: asFieldType(SelectBRecord),
  selectManyBRecords: asFieldType(SelectManyBRecords),
};
