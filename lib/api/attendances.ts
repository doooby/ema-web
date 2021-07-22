import * as mappers from './mappers';
import {
  AssociatedRecord,
  AssociatedRecordsIndex,
  createAssociationsMapper,
  list, mandatoryProp,
} from './mappers';

const { object, recordId, prop, assoc, val } = mappers;

export interface Attendance {
  id: number;
  date: Date;
  group: AssociatedRecord;
  present_students: AssociatedRecord[];
}

interface Associations {
  group: AssociatedRecordsIndex,
  student: AssociatedRecordsIndex,
}

export function mapAttendance (value: any, associations?: Associations): Attendance {
  return object(value, root => ({
    id: recordId(root),
    date: prop('date', root, val.date),
    group: assoc('group', root, associations!.group),
    present_students: prop('present_students_ids', root, students => list(
      students,
      studentId => mandatoryProp<AssociatedRecord>(studentId, associations?.student!),
    )),
  }));
}
export const mapAssociations = createAssociationsMapper<Associations>('group', 'student');
