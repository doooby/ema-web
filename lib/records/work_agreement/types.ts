import { BRecord } from '~/lib/api2';

export interface WorkAgreement {
  id: string;
  country: BRecord;
  person: BRecord;
  // projects: BRecord[];
  // donors: BRecord[];
  position?: string;
  starts_on?: Date;
  ends_on?: Date;
  resigned_on?: Date;
  comment?: string;
  created_at: Date;
  updated_at: Date;
  archived_at?: Date;
}
