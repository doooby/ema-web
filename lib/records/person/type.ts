import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records';

export interface Associations {
  country: mappers.AssociatedRecordsIndex,
}

export interface Person {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  first_name: [string, string];
  last_name: [string, string];
  caregivers?: PersonCaregiver[];
  born_on: Date;
  gender?: string;
  citizen_id?: string;
  passport_no?: string;
  telephone_no?: string;
  mother_tongue?: string;
  spoken_languages?: string;
  disability?: [string, undefined | string];
  disability_diagnosis?: boolean;
  assistance_needed?: boolean;
  assistance_provided?: boolean;
  disability_note?: string;
  residency_status?: string;
  school_transport?: string;
  school_distance_km?: number;
  school_distance_min?: number;
}

export interface PersonCaregiver {
  relation: string;
  first_name?: [string, string];
  last_name?: [string, string];
  gender?: string;
  citizen_id?: string;
  phone_no?: string;
  email?: string;
  cash_for_work?: boolean;
  humansis_cfw_id?: string;
}

export function parse (value: any, associations?: Associations): Person {
  return mappers.object(value, root => ({
    id: mappers.recordId(root),
    country: mappers.assoc('country', root, associations?.country),
    first_name: mappers.prop('first_name', root, mappers.val.nameTuple),
    last_name: mappers.prop('last_name', root, mappers.val.nameTuple),
    born_on: mappers.prop('born_on', root, mappers.val.date),
    caregivers: mappers.maybeProp('caregivers', root, parseCaregivers),
  }));
}

function parseCaregivers (value: any): undefined | PersonCaregiver[] {
  if (!value) return;
  return mappers.listOfObjects(value, item => ({
    relation: mappers.prop('relation', item, mappers.val.string),
    first_name: mappers.maybeProp('first_name', item, mappers.val.nameTuple),
    last_name: mappers.maybeProp('first_name', item, mappers.val.nameTuple),
    gender: mappers.maybeProp('gender', item, mappers.val.string),
    citizen_id: mappers.maybeProp('citizen_id', item, mappers.val.string),
    phone_no: mappers.maybeProp('phone_no', item, mappers.val.string),
    email: mappers.maybeProp('email', item, mappers.val.string),
    cash_for_work: mappers.maybeProp('cash_for_work', item, mappers.val.boolean),
    humansis_cfw_id: mappers.maybeProp('humansis_cfw_id', item, mappers.val.string),
  }));
}

export const parseAssociations = mappers.createAssociationsMapper<Associations>(
  'country',
);
