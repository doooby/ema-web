import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records/country';

const { object, recordId, prop, assoc, val } = mappers;

export interface EducationLevel {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  name_en: string;
  name: string;
  level: number;
}

export interface EducationLevelAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export function mapEducationLevel (value: any, associations?: EducationLevelAssociations): EducationLevel {
  return object(value, root => ({
    id: recordId(root),
    country: assoc('country', root, associations?.country),
    name_en: prop('name_en', root, val.string),
    name: prop('name', root, val.string),
    level: prop('level', root, val.integer),
  }));
}

export const mapEducationLevelAssociations = mappers.createAssociationsMapper<EducationLevelAssociations>(
  'country',
);
