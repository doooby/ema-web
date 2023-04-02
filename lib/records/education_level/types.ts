import { BRecord } from '~/lib/api2';
import { application_record } from '~/lib/records';

export interface EducationLevel extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
  level: number;
}
