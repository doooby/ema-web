import * as mappers from '~/lib/api/mappers';

export interface Subject {
  id: number;
  name: string;
  education_level: mappers.AssociatedRecord;
}

export interface SubjectAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}
