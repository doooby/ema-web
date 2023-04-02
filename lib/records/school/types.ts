import * as mappers from '~/lib/api/mappers';

export interface School {
  address?: string[];
  id: number;
  classrooms_count: number;
  country: mappers.AbbreviatedRecord;
  director?: mappers.AbbreviatedRecord;
  education_levels: mappers.AbbreviatedRecord[];
  education_types: string[];
  external_id: string;
  female_latrines_count: number;
  gender_dedications: string[];
  male_latrines_count: number;
  name: [string, string];
}

export interface SchoolAssociations {
  country: mappers.AssociatedRecordsIndex,
  education_level: mappers.AssociatedRecordsIndex,
  director: mappers.AssociatedRecordsIndex,
}
