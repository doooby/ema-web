import { BRecord } from '~/lib/api2';
import { application_record } from '~/lib/records';

export interface Project extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
  code?: string;
  short_name_en?: string;
  starts_on?: Date;
  ends_on?: Date;
  donors?: BRecord[];
  schools?: BRecord[];
}
