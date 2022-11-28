import { Params } from '..';
import * as mappers from '../mappers';
import { School, school, SchoolAssociations } from '~/lib/records';
import { recordEndpoints } from '~/lib/api/queries/lib/records';

export const record = recordEndpoints<
  School,
  SchoolAssociations
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
    mapper: (payload: any) => mappers.associatedRecords<School>(payload),
  };
}

export function update (schoolId: number, school: Params) {
  return {
    path: `/schools/${schoolId}/update`,
    params: { school },
    mapper: mappers.changedRecord,
  };
}
