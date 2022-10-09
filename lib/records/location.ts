import * as mappers from '~/lib/api/mappers';

export interface Location {
  id: number;
  level: number;
  parent_id?: number;
  name: string[];
}

export const location = {
  mapRecord (value: any): mappers.InvalidRecord | Location {
    return mappers.safeRecord(value, record => ({
      id: mappers.recordId(record),
      name: mappers.prop('name', record, mappers.val.nameTuple),
      level: mappers.prop('level', record, mappers.val.integer),
      parent_id: mappers.maybeProp('parent_id', record, mappers.val.integer),
    }));
  },
};
