import * as mappers from '~/lib/api/mappers';
import { location_system } from '~/lib/records';

export * from './types';

export function mapRecord (value): mappers.InvalidRecord | location_system.LocationSystem {
  return mappers.safeRecord(value, record => ({
    id: mappers.recordId(record),
    name: mappers.prop('name', record, mappers.val.nameTuple),
    levels: mappers.prop('levels', record, mappers.val.integer),
    settings: mappers.maybeProp('settings', record, value => mappers.object(
      value,
      value => value, // TODO strict?
    )),
  }));
}

export async function loadAddress (
  system: location_system.LocationSystem,
  value: string[],
  api: any,
): Promise<null | location_system.LocationItem[]> {
  const items: location_system.LocationItem[] = [];
  const loadables: number[] = [];

  for (let index = 0; index < system.levels; index += 1) {
    const levelValue = value[index];
    if (levelValue === undefined) break;
    const level = index + 1;
    switch (system.settings?.[level]?.type) {
      case 's':
        loadables.push(index);
        break;
      default:
        items[index] = { type: 't', text: levelValue };
    }
  }

  if (loadables.length) {
    const queryState = api.newQueryState();
    const ids = loadables.map(index => value[index]).filter(id => id);
    await api.request(
      api.queries.locations.index({
        location_system_id: system.id,
        ids,
      }),
      queryState,
    );
    if (!queryState.value) return null;
    const locations: Record<string, any> = queryState.value.records.reduce(
      (memo, location) => {
        memo[location.id] = location;
        return memo;
      }, {});

    for (let index = 0; index < loadables.length; index += 1) {
      const id = value[index];
      const location = locations[id];
      if (!location) return null;
      items[index] = { type: 's', location };
    }
  }

  return items;
}
