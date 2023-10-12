import { recordsQueries } from '~/lib/api2';
import { Location } from '~/lib/records/location';
import { wai } from '~/vendor/wai';
import { mapName } from '~/lib/api2/mappers';
// import { times } from 'lodash';

export const entity = 'location_systems';

export interface LocationSystem {
  id: string;
  name?: string[];
  levels: LocationSystemLevel[];
}

export interface LocationSystemLevel {
  type: 'l' | 't';
  name: string[];
}

export type LocationItem =
  | {
  type: 'l';
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
    // const levels = wai.prop('levels', value, wai.integer);
    return {
      id: wai.prop('id', value, wai.string),
      name: wai.prop('name', value, wai.nullable(mapName)),
      levels: [],
      // levels: wai.prop('settings', value, value => parseSettings(value, levels)),
    };
  })(value);
}

// function parseSettings (
//   value,
//   levels: number,
// ): LocationSystemLevel[] {
//   if (!wai.isObject(value)) {
//     throw new wai.MappingError('not object');
//   }
//   const list: LocationSystemLevel[] = [];
//   times(levels, (index) => {
//     list[index] = wai.prop(index + 1, value, (value) => {
//       const item = wai.object(value => ({
//         type: wai.prop('type', value, wai.string),
//         name: wai.prop('name', value, mapName),
//       }))(value);
//       if (!item.type.match(/^[lt]$/)) {
//         throw new wai.MappingError(`invalid level type: ${item.type}`);
//       }
//       return item as LocationSystemLevel;
//     });
//   });
//   return list;
// }

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
