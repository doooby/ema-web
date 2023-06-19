import { recordsQueries } from '~/lib/api2';
import { Location } from '~/lib/records/location';
import { wai } from '~/vendor/wai';
import { mapName } from '~/lib/api2/mappers';

export const entity = 'location_systems';

export interface LocationSystem {
  id: string;
  name?: string[];
  levels: number;
  settings?: Record<string, undefined | LocationSystemLevel>;
}

export interface LocationSystemLevel {
  type: 's' | 't';
  name: string[];
}

export type LocationItem =
  | {
  type: 's';
  location: Location;
}
  | {
  type: 't';
  text?: string;
};

export function parseRecord (
  value: unknown,
): LocationSystem {
  return wai.object((value) => {
    const levels = wai.prop('levels', value, wai.integer);
    return {
      id: wai.prop('id', value, wai.string),
      name: wai.prop('name', value, wai.nullable(mapName)),
      levels,
      settings: wai.prop('settings', value, wai.nullable(
        wai.object(value => parseSettings(levels, value)),
      )),
    };
  })(value);
}

function parseSettings (
  levels: number,
  value: unknown,
): Record<string, undefined | LocationSystemLevel> {
  return { 1: { type: 's', name: [ 'fds' ] } };
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
};

// export async function loadAddress (
//   system: location_system.LocationSystem,
//   value: string[],
//   api: any,
// ): Promise<null | location_system.LocationItem[]> {
//   const items: location_system.LocationItem[] = [];
//   const loadables: number[] = [];
//
//   for (let index = 0; index < system.levels; index += 1) {
//     const levelValue = value[index];
//     if (levelValue === undefined) break;
//     const level = index + 1;
//     switch (system.settings?.[level]?.type) {
//       case 's':
//         loadables.push(index);
//         break;
//       default:
//         items[index] = { type: 't', text: levelValue };
//     }
//   }
//
//   if (loadables.length) {
//     const queryState = api.newQueryState();
//     const ids = loadables.map(index => value[index]).filter(id => id);
//     await api.request(
//       api.queries.locations.index({
//         location_system_id: system.id,
//         ids,
//       }),
//       queryState,
//     );
//     if (!queryState.value) return null;
//     const locations: Record<string, any> = queryState.value.records.reduce(
//       (memo, location) => {
//         memo[location.id] = location;
//         return memo;
//       }, {});
//
//     for (let index = 0; index < loadables.length; index += 1) {
//       const id = value[index];
//       const location = locations[id];
//       if (!location) return null;
//       items[index] = { type: 's', location };
//     }
//   }
//
//   return items;
// }
