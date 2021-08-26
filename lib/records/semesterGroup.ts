import * as mappers from '~/lib/api/mappers';

export interface SemesterGroup {
  id: number;
  name: string
  year_start: number;
  semester: number;
  school: mappers.AssociatedRecord;
  course: mappers.AssociatedRecord;
}

export interface SemesterGroupAssociations {
  school: mappers.AssociatedRecordsIndex,
  course: mappers.AssociatedRecordsIndex,
}
