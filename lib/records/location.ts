import { Api2Plugin, mappers } from '~/lib/api2';
import app from '~/lib/app';
import { location_system } from '~/lib/records';
import { wai } from '~/vendor/wai';

export interface Location extends wai.AResource {
  level: number;
  parent_id: app.Maybe<number>;
  name: [string, string];
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

export async function browseLocationsOfParent (
  $api2: Api2Plugin,
  system: app.Maybe<location_system.V3_LocationSystem>,
  parent_id?: number,
) {
  if (!system) return;

  const request = await $api2.V3_request({
    path: '/locations',
    params: {
      per_page: 25,
      location_system_id: system.id,
      parent_id,
    },
    reducer: value => wai.recordsList(value, parseRecord),
  });
  return request.okPayload;
}
