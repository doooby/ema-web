import * as mappers from '~/lib/api/mappers';
import { course } from '~/lib/records';

export function show (systemId: number) {
  return {
    path: `/location_systems/${systemId}`,
    mapper: (payload: any) => mappers.record(payload, course.mapRecord, course.mapAssociations),
  };
}
