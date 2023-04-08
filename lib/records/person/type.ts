import { application_record } from '~/lib/records';
import { BRecord } from '~/lib/api2';

export interface Person extends application_record.SharedAttributes {
  country: BRecord;
  student_kobo_no?: string;
  first_name: string[];
  last_name: string[];
  caregivers?: PersonCaregiver[];
  born_on?: Date;
  gender?: string;
  citizen_id?: string;
  passport_no?: string;
  telephone_no?: string;
  enrollment_reasons?: string[];
  registered_on?: Date;
  mother_tongue?: string;
  outside_school?: string;
  nationality?: string;
  spoken_languages?: string[];
  disabilities?: [string, undefined | string];
  disability_diagnosis?: boolean;
  assistance_needed?: boolean;
  assistance_provided?: boolean;
  disability_note?: string;
  residency_status?: [string, undefined | string];
  school_transport?: [string, undefined | string];
  school_distance_km?: number;
  school_distance_min?: number;
}

export interface PersonCaregiver {
  relation: [string, undefined | string];
  first_name?: string[];
  last_name?: string[];
  citizen_id?: string;
  phone_no?: string;
  email?: string;
  cash_for_work?: boolean;
  humansis_cfw_id?: string;
}
