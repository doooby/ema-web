import { BRecord } from '~/lib/api2';
import { application_record } from '~/lib/records';

export interface Donor extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
  code?: string;
}
