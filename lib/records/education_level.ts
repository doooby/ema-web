import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records/country';

const { object, recordId, prop, assoc, val } = mappers;

export interface EducationLevel {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  name: [string, string];
  level: number;
}

export interface EducationLevelAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export function mapEducationLevel (value: any, associations?: EducationLevelAssociations): EducationLevel {
  return object(value, root => ({
    id: recordId(root),
    country: assoc('country', root, associations?.country),
    name: prop('name', root, val.nameTuple),
    level: prop('level', root, val.integer),
  }));
}

export const mapEducationLevelAssociations = mappers.createAssociationsMapper<EducationLevelAssociations>(
  'country',
);
