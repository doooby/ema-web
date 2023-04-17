import { BRecord } from '~/lib/api2';
import { application_record } from '~/lib/records';

export interface SchoolYear extends application_record.SharedAttributes {
  country: BRecord;
  education_levels?: BRecord[];
  name: string[];
  year_label: string;
  terms?: { from: Date, to: Date }[];
}
