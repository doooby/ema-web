import { wai } from '~/vendor/wai';

export const entity = 'groups/dropouts';

export interface Dropout extends wai.AResource {
  record?: RecordSlice;
  group?: GroupSlice;
}

interface RecordSlice {
  group: wai.AResource;
  student: wai.AResource;
  created_at: Date;
  created_by?: {
    login: string;
    name: string[];
  };
  reasons?: string[];
  note?: string;
  dropout_on: Date;
  return_on?: Date;
}

export interface GroupSlice {
  school: wai.AResource;
  course: wai.AResource;
  group: wai.AResource;
}

export function parseRecord (
  value,
  associations: wai.Associations,
): Dropout {
  return wai.object(record => ({
    record: wai.property(record, 'record', wai.nullable(value => parseRecordSlice(value, associations))),
    group: wai.property(record, 'group', wai.nullable(parseGroupSlice)),
  }))(value);
}

function parseRecordSlice (
  value,
  associations: wai.Associations,
): RecordSlice {
  return wai.object(value => ({
    student: wai.property(value, 'student_id',
      id => wai.associatedRecord(associations, 'people', id),
    ),
    group: wai.property(value, 'group_id',
      id => wai.associatedRecord(associations, 'groups', id),
    ),
    created_at: wai.property(value, 'created_at', wai.time),
    created_by: wai.property(value, 'created_by',
      wai.object(value => ({
        login: wai.property(value, 'login', wai.string),
        name: wai.property(value, 'name', wai.listOfStrings),
      })),
    ),
    reasons: wai.property(value, 'reasons', wai.nullable(wai.listOf(wai.string))),
    note: wai.property(value, 'note', wai.nullable(wai.string)),
    dropout_on: wai.property(value, 'dropout_on', wai.time),
    return_on: wai.property(value, 'return_on', wai.nullable(wai.time)),
  }))(value);
}

function parseGroupSlice (value): GroupSlice {
  return wai.object(value => ({
    school: wai.property(value, 'school', wai.aResource),
    course: wai.property(value, 'course', wai.aResource),
    group: wai.property(value, 'group', wai.aResource),
  }))(value);
}
