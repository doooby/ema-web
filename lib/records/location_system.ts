import { wai } from '~/vendor/wai';
import { times } from 'lodash';
import { mappers } from '~/lib/api2';
import { location_system } from '~/lib/records/index';
import app from '~/lib/app';

export interface V3_LocationSystem extends wai.AResource {
  levels: number;
  settings: LocationSystemLevel[];
}

export interface LocationSystemLevel {
  type: 'l' | 't';
  name: string[];
}

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

export function unnestLevelsSettings (system?: location_system.V3_LocationSystem) {
  const levels: app.List<location_system.LocationSystemLevel> = [];
  times(system?.levels ?? 0, (index) => {
    levels[index] = system?.settings[index];
  });
  return levels.filter(a => a) as location_system.LocationSystemLevel[];
}
