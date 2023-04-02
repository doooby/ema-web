import { BRecord } from '~/lib/api2';
import { application_record } from '~/lib/records';

export interface WorkAgreement extends application_record.SharedAttributes {
  school: BRecord;
  person: BRecord;
  projects?: BRecord[];
  donors?: BRecord[];
  position?: string;
  starts_on?: Date;
  ends_on?: Date;
  resigned_on?: Date;
  comment?: string;
}
