import { application_record, user } from '~/lib/records';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import Privileges from '~/components/database/records/users/controls/Privileges.vue';
import { BRecord, parsers, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapName, mapOptionalAssociation } from '~/lib/api2/mappers';

export const entity = 'users';

export interface User extends application_record.SharedAttributes {
  country?: BRecord;
  login: string;
  full_name: string[];
  lock?: string;
  privileges: UserPrivilege[];
  is_root: boolean;
}

export interface UserPrivilege {
  type: null | 'country_admin' | 'view_only' | 'school_manager';
  [ opt: string ]: any;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): user.User {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapOptionalAssociation('countries', associations)),
    login: wai.prop('login', value, wai.string),
    full_name: wai.prop('full_name', value, mapName),
    lock: wai.prop('lock', value, wai.nullable(wai.string)),
    is_root: wai.prop('is_root', value, wai.boolean),
    privileges: wai.prop('privileges', value, wai.listOf(value => mapUserPrivilege(value, associations))),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
  changePassword (id: number, password: string) {
    return {
      path: `/${entity}/${id}/change_password`,
      params: { password },
      reducer: parsers.updatedRecordResponsePayload(),
    };
  },
  lock (
    id: number,
    params: { lock: boolean, wipe_password: boolean },
  ) {
    return {
      path: `/${entity}/${id}/lock`,
      params,
      reducer: parsers.updatedRecordResponsePayload(),
    };
  },
};

export function entityControls (): FormFieldDefinition[] {
  return [
    [ 'login', controls.text ],
    [ 'full_name', controls.name ],
    [ 'privileges', asFieldType(Privileges) ],
    [ 'is_root', controls.boolean ],
  ];
}

export function mapUserPrivilege (value: any, associations?: RecordAssociations): user.UserPrivilege {
  // noinspection UnnecessaryLocalVariableJS
  const privilege = {
    type: value?.type ?? null,
  } as any;
  switch (value?.type) {
    case 'school_manager':
      if (value.school_id) {
        privilege.school = mapAssociation('schools', associations)(value.school_id);
      }
      break;
  }
  return Object.freeze(privilege);
}
