import * as mappers from '~/lib/api/mappers';
import * as dbFields from '~/components/database/controls';
import { FormFieldDefinition } from '~/components/Form';

const { object, recordId, prop, maybeProp, maybeAssoc, val, list } = mappers;

export interface User {
  id: number;
  login: string;
  full_name_en?: string;
  full_name?: string;
  lock?: string;
  country?: mappers.AssociatedRecord;
  is_root: boolean;
  is_can_admin: boolean;
  is_can_web: boolean;
  is_can_mng_users: boolean;
}

export interface UserAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export function mapUser (value: any, associations?: UserAssociations): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    full_name_en: maybeProp('full_name_en', root, val.string),
    full_name: maybeProp('full_name', root, val.string),
    lock: maybeProp('lock', root, val.string),
    country: maybeAssoc('country', root, associations?.country),
    is_root: prop('is_root', root, val.boolean),
    is_can_admin: prop('is_can_admin', root, val.boolean),
    is_can_web: prop('is_can_web', root, val.boolean),
    is_can_mng_users: prop('is_can_mng_users', root, val.boolean),
  }));
}

export const mapUserAssociations = mappers.createAssociationsMapper<UserAssociations>(
  'country',
);

export interface SessionUser {
  id: number;
  login: string;
  name_en?: string;
  name?: string;
  countries: mappers.AssociatedRecord[];
}

export function mapSessionUser (value: any): SessionUser {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    name_en: maybeProp('name_en', root, val.string),
    name: maybeProp('name', root, val.string),
    countries: prop('countries', root, countries => list(countries, val.assoc)),
  }));
}

export const user = {
  entityControls (): FormFieldDefinition[] {
    return [
      [ 'country', dbFields.AssociatedRecord, { entity: 'countries', optional: true } ],
      [ 'login', 'text' ],
      [ 'full_name_en', 'text' ],
      [ 'full_name', 'text' ],
      [ 'is_root', 'boolean' ],
      [ 'is_can_admin', 'boolean' ],
      [ 'is_can_web', 'boolean' ],
      [ 'is_can_mng_users', 'boolean' ],
    ];
  },
};
