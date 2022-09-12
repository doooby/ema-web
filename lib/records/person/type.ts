import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records';

export interface Person {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  family_name_en: string;
  family_name: string;
  given_name_en: string;
  given_name: string;
  born_on?: Date;
}

export interface Associations {
  country: mappers.AssociatedRecordsIndex,
}

export interface PersonCaregiver {
  relation?: string;
  first_name?: [string, string];
  last_name?: [string, string];
  gender?: string;
  citizen_id?: string;
  phone_no?: string;
  email?: string;
  cfw?: string;
  humansis_cfw_id?: string;
}

export function parse (value: any, associations?: Associations): Person {
  return mappers.object(value, root => ({
    id: mappers.recordId(root),
    country: mappers.assoc('country', root, associations?.country),
    family_name_en: mappers.prop('family_name_en', root, mappers.val.string),
    family_name: mappers.prop('family_name', root, mappers.val.string),
    given_name_en: mappers.prop('given_name_en', root, mappers.val.string),
    given_name: mappers.prop('given_name', root, mappers.val.string),
    born_on: mappers.maybeProp('born_on', root, mappers.val.date),
  }));
}

export const parseAssociations = mappers.createAssociationsMapper<Associations>(
  'country',
);
