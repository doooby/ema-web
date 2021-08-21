import * as mappers from '~/lib/api/mappers';

export interface Course {
  id: number;
  name: string;
  education_level: mappers.AssociatedRecord;
}

export interface CourseAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}
