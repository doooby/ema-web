import { BRecord } from '~/lib/api2';

export interface Donor {
  id: string;
  country: BRecord;
  name: string[];
  code?: string;
}
