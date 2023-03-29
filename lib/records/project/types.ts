import { BRecord } from '~/lib/api2';

export interface Project {
  id: string;
  country: BRecord;
  name: string[];
  code?: string;
  short_name_en?: string;
  starts_on?: Date;
  ends_on?: Date;
  donors?: BRecord[];
  schools?: BRecord[];
}
