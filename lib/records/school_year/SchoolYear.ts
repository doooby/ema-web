import { BRecord } from '~/lib/api2';

export interface SchoolYear {
  id: string;
  country: BRecord;
  education_levels: BRecord[];
  name: string[];
  year_label: string;
  terms: { from: Date, to: Date }[];
}
