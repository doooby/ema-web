import { wai } from '~/vendor/wai';

export interface Dropout extends wai.AResource {
  record?: RecordSlice;
}

interface RecordSlice {
  students: wai.AResource[];
  created_at: Date;
  created_by?: {
    login: string;
    name: string[];
  };
  reasons?: string[];
  note: string;
}

export function parseRecord (
  value,
  associations: wai.Associations,
): Dropout {
  return wai.uncertainResource(record => ({
    record: wai.property(record, 'record', wai.nullable(value => parseRecordSlice(value, associations))),
  }))(value, associations);
}

function parseRecordSlice (
  value,
  associations: wai.Associations,
): RecordSlice {
  return wai.object(value => ({
    students: wai.property(value, 'students_ids',
      wai.listOf(id => wai.associatedRecord(associations, 'people', id)),
    ),
    created_at: wai.property(value, 'created_at', wai.time),
    created_by: wai.property(value, 'created_by',
      wai.object(value => ({
        login: wai.property(value, 'login', wai.string),
        name: wai.property(value, 'name', wai.listOfStrings),
      })),
    ),
    reasons: wai.property(value, 'reasons', wai.nullable(wai.listOf(wai.string))),
    note: wai.property(value, 'note', wai.string),
  }))(value);
}
