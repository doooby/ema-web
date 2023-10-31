import { wai } from '~/vendor/wai';

export interface StudentsChange extends wai.AResource {
  assignment_record?: AssignmentRecordSlice;
}

interface AssignmentRecordSlice {
  students: wai.AResource[];
  operation: 'a' | 'r';
  created_at: Date;
  created_by: {
    login: string;
    name: string[];
  };
}

export function parseRecord (
  value,
  associations: wai.Associations,
): StudentsChange {
  return wai.uncertainResource(record => ({
    assignment_record: wai.property(record, 'assignment_record', wai.nullable(value => parseAssignmentRecordSlice(value, associations))),
  }))(value, associations);
}

function parseAssignmentRecordSlice (
  value,
  associations: wai.Associations,
): AssignmentRecordSlice {
  return wai.object(value => ({
    students: wai.property(value, 'students_ids',
      wai.listOf(id => wai.associatedRecord(associations, 'people', id)),
    ),
    operation: wai.property(value, 'operation',
      (value) => {
        switch (value) {
          case 'a':
          case 'r':
            return value;
          default:
            throw new wai.MappingError('bad operation');
        }
      },
    ),
    created_at: wai.property(value, 'created_at', wai.time),
    created_by: wai.property(value, 'created_by',
      wai.object(value => ({
        login: wai.property(value, 'login', wai.string),
        name: wai.property(value, 'name', wai.listOfStrings),
      })),
    ),
  }))(value);
}
