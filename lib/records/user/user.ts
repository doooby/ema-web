import { application_record, user } from '~/lib/records';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import Privileges from '~/components/database/records/users/controls/Privileges.vue';
import { RecordAssociations } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapName, mapOptionalAssociation } from '~/lib/api2/mappers';

export function entityControls (): FormFieldDefinition[] {
  return [
    [ 'login', 'text' ],
    [ 'full_name', controls.name ],
    [ 'privileges', asFieldType(Privileges) ],
    [ 'is_root', 'boolean' ],
  ];
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
    privileges: wai.prop('privileges', value, wai.listOf(mapUserPrivilege)),
  }))(value);
}

// TODO for now it registers only type of the privilege
export function mapUserPrivilege (value: any): user.UserPrivilege {
  // noinspection UnnecessaryLocalVariableJS
  const privilege = {
    type: value?.type ?? null,
  } as any;
  // switch (value?.type) {
  //   case 'country_admin':
  // }
  return Object.freeze(privilege);
}
