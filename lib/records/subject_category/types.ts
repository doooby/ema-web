import { application_record } from '~/lib/records';
import { BRecord } from '~/lib/api2';

export interface SubjectCategory extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
}
