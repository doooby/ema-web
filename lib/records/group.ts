import { BRecord, Params, parsers, RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapName } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'groups';

export interface Group extends application_record.SharedAttributes {
  course: BRecord;
  school: BRecord;
  students?: BRecord[];
  name: string[];
  term: number;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): Group {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    course: wai.prop('course_id', value, mapAssociation('courses', associations)),
    school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    students: wai.prop('students_ids', value, mapAssociations('students', associations)),
    name: wai.prop('name', value, mapName),
    term: wai.prop('term', value, wai.integer),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
  change_students (params: Params) {
    return {
      path: `/${entity}/${params.id}/change_students`,
      params: { students_ids: params.students_ids },
      reducer: parsers.updatedRecordResponsePayload(),
    };
  },
  move_students (params: Params) {
    return {
      path: `/${entity}/move_students`,
      params,
      reducer: parsers.updatedRecordResponsePayload(),
    };
  },
};

export function entityControls (): FormFieldDefinition[] {
  return [
    [ 'course', dbFields.selectBRecord, { entity: 'courses' } ],
    [ 'name', controls.name ],
    [ 'term', controls.integer ],
  ];
}
