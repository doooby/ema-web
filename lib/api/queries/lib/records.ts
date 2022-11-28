import * as mappers from '../../mappers';
import { Params } from '~/lib/api';

export function recordEndpoints<R extends mappers.RecordBase, RA> ({
  entity,
  path = entity,
  paramName,
  mapRecord,
  mapAssociations,
}: {
  entity: string;
  path?: string;
  paramName: string;
  mapRecord(value, associations?: RA): mappers.InvalidRecord | R;
  mapAssociations(value): RA;
}): {

} {
  return {

    index (params: Params) {
      return {
        path: `/${path}`,
        params,
        mapper: payload => mappers.paginatedRecords(
          payload, mapRecord, mapAssociations,
        ),
      };
    },

    show (recordId: number) {
      return {
        path: `/${path}/${recordId}`,
        mapper: payload => mappers.record(
          payload, mapRecord, mapAssociations,
        ),
      };
    },

    create (record: Params) {
      return {
        path: `/${path}/create`,
        params: { [paramName]: record },
        mapper: mappers.changedRecord,
      };
    },

    archive (recordId: number) {
      return {
        path: `/${path}/${recordId}/archive`,
        mapper: mappers.changedRecord,
      };
    },

    update (recordId: number, changes: Params) {
      return {
        path: `/${path}/${recordId}/update`,
        params: { [paramName]: changes },
        mapper: mappers.changedRecord,
      };
    },

  };
}
