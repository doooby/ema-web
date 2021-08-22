import * as mappers from '~/lib/api/mappers';

export interface SemesterGroup {
  id: number;
  name: string
  year_start: number;
  semester: number;
  course: mappers.AssociatedRecord;
}

export interface SemesterGroupAssociations {
  course: mappers.AssociatedRecordsIndex,
}
