import { wai } from '~/vendor/wai';
import { mapDate } from '~/lib/api2/mappers';

export interface SharedAttributes {
  id: string;
  created_at: Date;
  updated_at?: Date;
  archived_at?: Date;
}

export function parseSharedAttributes (value): SharedAttributes {
  return {
    id: wai.prop('id', value, wai.string),
    created_at: wai.prop('created_at', value, mapDate),
    updated_at: wai.prop('updated_at', value, wai.nullable(mapDate)),
    archived_at: wai.prop('archived_at', value, wai.nullable(mapDate)),
  };
}
