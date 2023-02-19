import { Params, parsers, RecordAssociations } from '~/lib/api2';

export function recordQueries<R> (
  path: string,
  paramName: string,
  recordParser: (value: unknown, associations?: RecordAssociations) => R,
) {
  return {
    search (params: Params) {
      return {
        path: `/${path}`,
        params,
        reducer: parsers.searchResponsePayload(recordParser),
      };
    },
    create (record: Params) {
      return {
        path: `/${path}/create`,
        params: { [paramName]: record },
        reducer: parsers.updatedRecordResponsePayload,
      };
    },
    update (id: string, record: Params) {
      return {
        path: `/${path}/${id}/update`,
        params: { [paramName]: record },
        reducer: parsers.updatedRecordResponsePayload,
      };
    },
  };
}
