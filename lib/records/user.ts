import { application_record, location_system, user } from '~/lib/records';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import Privileges from '~/components/database/records/users/controls/Privileges.vue';
import { BRecord, parsers, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapIndex, mapName, mapOptionalAssociation } from '~/lib/api2/mappers';
import app from '~/lib/app';

export const entity = 'users';
export * from './user/index';

export interface User extends application_record.SharedAttributes {
  country?: BRecord;
  login: string;
  full_name: string[];
  lock?: string;
  privileges: UserPrivilege[];
  is_root: boolean;
}

export interface V3_User extends wai.AResource {
  session?: SessionSlice;
  current_country?: CurrentCountrySlice;
}

export interface UserPrivilege {
  type: null | 'country_admin' | 'view_only' | 'data_officer' | 'school_manager';
  [ opt: string ]: any;
}

export interface SessionSlice {
  id: string;
  login: string;
  name: string[];
  countries: wai.AResource[];
  admissible_actions?: app.Map<app.List<string>>;
  admission?: {
    actions: app.Map<unknown>;
  };
}

export interface CurrentCountrySlice {
  record: wai.AResource;
  current_school_year?: wai.AResource;
  locations: {
    address: app.Maybe<location_system.V3_LocationSystem>;
  };
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

export function V3_parseRecord (
  value,
  _associations: wai.Associations,
): V3_User {
  return wai.object(record => ({
    session: wai.property(record, 'session', wai.nullable(value => parseSessionSlice(value))),
    current_country: wai.property(record, 'current_country', wai.nullable(value => parseCurrentCountrySlice(value))),
  }))(value);
}

function parseSessionSlice (value): SessionSlice {
  return wai.object2(value, value => ({
    id: wai.property(value, 'id', wai.string),
    login: wai.property(value, 'login', wai.string),
    name: wai.property(value, 'name', mapName),
    countries: wai.property(value, 'countries', wai.listOf(wai.aResource)),
    admissible_actions: wai.property(value, 'admissible_actions',
      wai.nullable(mapIndex(wai.listOf(wai.string))),
    ),
    admission: wai.property(value, 'admission',
      wai.nullable(wai.object(value => Object.freeze(value))),
    ),
  }));
}

function parseCurrentCountrySlice (value): CurrentCountrySlice {
  return wai.object2(value, value => ({
    record: wai.property(value, 'record', wai.aResource),
    current_school_year: wai.property(value, 'current_school_year', wai.nullable(wai.aResource)),
    locations: wai.property(value, 'locations', wai.object(value => ({
      address: wai.property(value, 'address',
        wai.nullable(value => wai.uncertainResource(
          location_system.V3_parseRecord,
        )(value, {})),
      ),
    }))),
  }));
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
