import { Params } from '..';
import * as mappers from '../mappers';
import { school } from '~/lib/records';
import { recordEndpoints } from '~/lib/api/queries/lib/records';

export const record = recordEndpoints<
  school.School,
  school.SchoolAssociations
  >({
    entity: 'schools',
    paramName: 'school',
    mapRecord: school.mapRecord,
    mapAssociations: school.mapAssociations,
  });

export function searchAssociated (params?: Params) {
  return {
    path: '/schools?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords(payload),
  };
}
