import * as mappers from '~/lib/api/mappers';

export interface EducationLevel {
  id: number;
  name: string;
  level?: number;
  terms_per_year?: number;
  years_length?: number;
  start_age?: number;
  mandatory?: boolean;
  country: mappers.AssociatedRecord;
}

export interface EducationLevelAssociations {
  country: mappers.AssociatedRecordsIndex,
}
