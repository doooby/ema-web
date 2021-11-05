import * as mappers from '~/lib/api/mappers';

const { object, recordId, prop, maybeProp, assoc, val } = mappers;

export interface User {
  id: number;
  login: string;
  full_name_en?: string;
  full_name?: string;
  lock?: string;
  country: mappers.AssociatedRecord;
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
    country: assoc('country', root, associations?.country),
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
}

export function mapSessionUser (value: any): SessionUser {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    name_en: maybeProp('name_en', root, val.string),
    name: maybeProp('name', root, val.string),
  }));
}
