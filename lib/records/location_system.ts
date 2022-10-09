import * as mappers from '~/lib/api/mappers';

export interface LocationSystem {
  id: number;
  name: string[];
  levels: number;
  settings?: Record<string, undefined | LocationSystemLevel>;
}

export interface LocationSystemLevel {
  type: 's' | 't';
  name: string[];
}

export const location_system = {
  mapRecord (value: any): mappers.InvalidRecord | LocationSystem {
    return mappers.safeRecord(value, record => ({
      id: mappers.recordId(record),
      name: mappers.prop('name', record, mappers.val.nameTuple),
      levels: mappers.prop('levels', record, mappers.val.integer),
      settings: mappers.maybeProp('settings', record, value => mappers.object(
        value,
        value => value, // TODO strict?
      )),
    }));
  },
};
