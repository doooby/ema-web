import { BRecord } from '~/lib/api2';
import { application_record } from '~/lib/records';

export interface Group extends application_record.SharedAttributes {
  course: BRecord;
  school: BRecord;
  students?: BRecord[];
  name: string[];
  term: number;
}
