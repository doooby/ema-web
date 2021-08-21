import * as mappers from '~/lib/api/mappers';

export interface EducationLevel {
  id: number;
  name: string;
  grade: number;
  semesters: number;
  years_length: number;
  start_age: number;
  mandatory: boolean;
  country: mappers.AssociatedRecord;
}

export interface EducationLevelAssociations {
  country: mappers.AssociatedRecordsIndex,
}
