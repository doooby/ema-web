import * as mappers from '~/lib/api/mappers';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import { Country } from '~/lib/records/country';
import Privileges from '~/components/database/records/users/controls/Privileges.vue';

const { object, recordId, prop, maybeAssoc, val, list } = mappers;

export interface User {
  id: number;
  country?: mappers.AssociatedRecord<Country>;
  login: string;
  full_name: [string, string];
  lock: string;
  privileges: UserPrivilege[];
  is_root: boolean;
}

export interface UserPrivilege {
  type: null | 'country_admin' | 'collector' | 'data_officer';
  [ opt: string ]: any;
}

export interface UserAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export function mapUser (value: any, associations?: UserAssociations): User {
  return object(value, root => ({
    id: recordId(root),
    country: maybeAssoc('country', root, associations?.country),
    login: prop('login', root, val.string),
    full_name: prop('full_name', root, val.nameTuple),
    lock: prop('lock', root, val.string),
    privileges: prop('privileges', root, mapUserPrivileges),
    is_root: prop('is_root', root, val.boolean),
  }));
}

export const mapUserAssociations = mappers.createAssociationsMapper<UserAssociations>(
  'country',
);

// TODO for know it registers only type of the privilege
export function mapUserPrivilege (value: any): UserPrivilege {
  // noinspection UnnecessaryLocalVariableJS
  const privilege = {
    type: value?.type ?? null,
  } as any;
  // switch (value?.type) {
  //   case 'country_admin':
  // }
  return Object.freeze(privilege);
}

function mapUserPrivileges (value: any): UserPrivilege[] {
  return list(value, mapUserPrivilege);
}

export interface SessionUser {
  id: number;
  login: string;
  name: [string, string];
  countries: mappers.AssociatedRecord[];
}

export function mapSessionUser (value: any): SessionUser {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    name: prop('name', root, val.nameTuple),
    countries: prop('countries', root, countries => list(countries, val.assoc)),
  }));
}

export const user = {
  entityControls (): FormFieldDefinition[] {
    return [
      [ 'login', 'text' ],
      [ 'full_name', controls.name ],
      [ 'privileges', asFieldType(Privileges) ],
      [ 'is_root', controls.boolean ],
    ];
  },
};
