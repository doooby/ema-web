import { mappers } from '~/lib/api2';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';

export interface Location extends wai.AResource {
  level: number;
  parent_id: app.Maybe<number>;
  name: string[];
}

export function parseRecord (
  value,
) {
  return wai.object2(value, value => ({
    level: wai.property(value, 'level', value => wai.integer(value ?? -1)),
    parent_id: wai.property(value, 'parent_id', wai.nullable(wai.integer)),
    name: wai.property(value, 'name', value => mappers.mapName(value ?? [])),
  }));
}
