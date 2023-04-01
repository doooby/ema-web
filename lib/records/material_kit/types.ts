import { BRecord } from '~/lib/api2';

export interface MaterialKit {
  id: string;
  country: BRecord;
  name: string[];
  code?: string;
  contents?: string;
}
