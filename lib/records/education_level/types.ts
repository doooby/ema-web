import { BRecord } from '~/lib/api2';

export interface EducationLevel {
  id: number;
  country: BRecord;
  name: string[];
  level: number;
}
