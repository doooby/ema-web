import { BRecord } from '~/lib/api2';
import { application_record } from '~/lib/records';

export interface Subject extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
  education_levels?: BRecord[];
  categories?: BRecord[];
}
