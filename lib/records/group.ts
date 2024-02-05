import { BRecord, Params, parsers, RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapDate, mapName } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import app from '~/lib/app';

export const entity = 'groups';
export * from './group/index';

export interface Group extends application_record.SharedAttributes {
  course: BRecord;
  school: BRecord;
  school_year?: BRecord;
  students?: BRecord[];
  name: string[];
  term: number;
  term_info: [number, number];
  term_dates?: [Date, Date];
  parent?: wai.AResource;
  linked_groups?: wai.AResource[];
}

export interface V3_Group extends wai.AResource {
  school_course?: SchoolCourseSlice;
  students_list?: StudentsListSlice;
}

export interface SchoolCourseSlice {
  course: wai.AResource;
  school: wai.AResource;
}

export interface StudentsListSlice {
  students: app.Maybe<app.List<wai.AResource>>;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): Group {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    course: wai.prop('course_id', value, mapAssociation('courses', associations)),
    school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    school_year: wai.prop('school_year_id', value, wai.nullable(mapAssociation('school_years', associations))),
    students: wai.prop('students_ids', value, mapAssociations('students', associations)),
    caption: wai.property(value, 'caption', wai.string),
    name: wai.prop('name', value, mapName),
    term: wai.prop('term', value, wai.integer),
    term_info: wai.prop('term_info', value, wai.tuple(
      wai.integer,
      wai.integer,
    )),
    term_dates: wai.prop('term_dates', value, wai.nullable(wai.tuple(
      mapDate, mapDate,
    ))),
    parent: wai.property(value, 'parent', wai.nullable(wai.aResource)),
    linked_groups: wai.property(value, 'linked_groups', wai.nullable(wai.listOf(wai.aResource))),
  }))(value);
}

export function V3_parseRecord (
  value,
  associations: wai.Associations,
): V3_Group {
  return wai.object(record => ({
    school_course: wai.property(record, 'school_course', wai.nullable(value => parseComputedSlice(value))),
    students_list: wai.property(record, 'students_list', wai.nullable(value => parseStudentsListSlice(value, associations))),
  }))(value);
}

function parseComputedSlice (value): SchoolCourseSlice {
  return wai.object(value => ({
    course: wai.property(value, 'course', wai.aResource),
    school: wai.property(value, 'school', wai.aResource),
  }))(value);
}

function parseStudentsListSlice (
  value,
  associations: wai.Associations,
): StudentsListSlice {
  return wai.object(value => ({
    students: wai.property(value, 'students',
      wai.nullable(wai.listOf(
        value => wai.associatedRecord(associations, 'people', value),
      )),
    ),
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
  get_grades (params: Params) {
    return {
      path: `/${entity}/${params.id}/get_grades`,
      reducer: value => value,
    };
  },
  update_grades (params: Params) {
    return {
      path: `/${entity}/${params.id}/update_grades`,
      params: { subjects: params.subjects },
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
