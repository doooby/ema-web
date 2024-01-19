import { wai } from '~/vendor/wai';
import { times } from 'lodash';
import { Api2Plugin, mappers } from '~/lib/api2';
import app from '~/lib/app';

// TODO t-locations
// TODO remove
export interface LocationSystem {
  id: string;
  name?: string[];
  levels: LocationSystemLevel[];
}

export interface V3_LocationSystem extends wai.AResource {
  levels: number;
  settings: LocationSystemLevel[];
}

export interface LocationSystemLevel {
  type: 'l' | 't';
  name: string[];
}

// TODO t-locations
export type LocationItem =
  | {
  type: 'l';
  location: Location;
}
  | {
  type: 't';
  text?: string;
};

export function V3_parseRecord (
  value,
): V3_LocationSystem {
  return wai.object2(value, (value) => {
    const levels = wai.property(value, 'levels', wai.integer);
    return {
      levels,
      settings: wai.property(value, 'settings', value => parseSettings(value, levels)),
    };
  });
}

function parseSettings (
  value,
  levels: number,
): LocationSystemLevel[] {
  wai.throwUnlessIsObject(value);

  const list: LocationSystemLevel[] = [];

  function parseItem (value) {
    return wai.object2(value, value => ({
      type: wai.property(value, 'type', wai.string),
      name: wai.property(value, 'name', mappers.mapName),
    }));
  }

  times(levels, (index) => {
    list[index] = wai.property(value, index + 1,
      (value) => {
        const item = parseItem(value);
        if (!item.type.match(/^[lt]$/)) {
          throw new wai.MappingError(`invalid level type: ${item.type}`);
        }
        return item as LocationSystemLevel;
      },
    );
  });

  return list;
}

// TODO t-locations
// export async function loadAddress (
//   system: V3_LocationSystem,
//   value: string[],
//   api: any,
// ): Promise<null | LocationItem[]> {
//   const items: LocationItem[] = [];
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
