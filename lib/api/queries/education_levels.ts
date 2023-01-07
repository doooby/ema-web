import { Params } from '..';
import * as mp from '../mappers';
import { educationLevel, EducationLevel, EducationLevelAssociations } from '~/lib/records';
import { recordEndpoints } from '~/lib/api/queries/lib/records';

export const record = recordEndpoints<
  EducationLevel,
  EducationLevelAssociations
  >({
    entity: 'education_levels',
    paramName: 'education_level',
    mapRecord: educationLevel.mapRecord,
    mapAssociations: educationLevel.mapAssociations,
  });

export function searchAssociated (params?: Params) {
  return {
    path: '/education_levels?assoc=1',
    params,
    mapper: (payload: any) => mp.associatedRecords<EducationLevel>(payload),
  };
}
