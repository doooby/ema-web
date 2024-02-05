import { application_record, course } from '~/lib/records';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import GradingTypeField from '~/components/database/records/courses/GradingTypeField.vue';
import SubjectsField from '~/components/database/records/courses/SubjectsField.vue';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate, mapName, mapSelectOrFillTuple } from '~/lib/api2/mappers';
import { dbFields } from '~/components/database/fields';
import app from '~/lib/app';
import * as grading from './grading';

export { grading };

export const entity = 'courses';

export interface Course extends application_record.SharedAttributes {
  school: BRecord;
  education_level: BRecord;
  project?: BRecord;
  school_year?: BRecord;
  standardized_course?: BRecord;
  name: string[];
  grade: number;
  is_formal?: boolean;
  accreditation_authority?: [string, undefined | string];
  lesson_duration?: number;
  attendance_limit?: number;
  time_ranges: { from: Date, to: Date }[];
  preferred_grading?: [string, string, undefined | string];
  subjects?: CourseSubject[];
  groups_count: number;
  term_dates: app.List<{ begin: Date, end: Date }>;
}

export interface V3_Course extends wai.AResource {
  record?: RecordSlice;
  computed?: ComputedSlice;
}

interface RecordSlice {
  education_level: wai.AResource;
  project?: wai.AResource;
  school: wai.AResource;
  school_year?: wai.AResource;
  standardized_course?: wai.AResource;

  accreditation_authority?: [string, undefined | string];
  attendance_limit?: number;
  grade: number;
  groups_count: number;
  is_formal?: boolean;
  lesson_duration?: number;
  name: string[];
  preferred_grading?: [string, string, undefined | string];
  time_ranges: { from: Date, to: Date }[];
}

interface ComputedSlice {
  term_dates: app.List<{ begin: Date, end: Date }>;
}

export interface CourseSubject {
  subject: BRecord;
  grading?: [string, string, undefined | string];
  exam?: boolean;
  teacher?: BRecord;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): Course {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    project: wai.prop('project_id', value, wai.nullable(mapAssociation('projects', associations))),
    education_level: wai.prop('education_level_id', value, mapAssociation('education_levels', associations)),
    school_year: wai.prop('school_year_id', value, wai.nullable(mapAssociation('school_years', associations))),
    standardized_course: wai.prop('standardized_course_id', value, wai.nullable(mapAssociation('standardized_courses', associations))),
    caption: wai.property(value, 'caption', wai.string),
    name: wai.prop('name', value, mapName),
    grade: wai.prop('grade', value, wai.integer),
    is_formal: wai.prop('is_formal', value, wai.nullable(wai.boolean)),
    accreditation_authority: wai.prop('accreditation_authority', value, wai.nullable(mapSelectOrFillTuple)),
    lesson_duration: wai.prop('lesson_duration', value, wai.nullable(wai.integer)),
    attendance_limit: wai.prop('attendance_limit', value, wai.nullable(wai.integer)),
    time_ranges: wai.prop('time_ranges', value, wai.listOf(
      wai.object(value => ({
        from: wai.prop('from', value, mapDate),
        to: wai.prop('to', value, mapDate),
      })),
    )),
    preferred_grading: wai.prop('preferred_grading', value, wai.nullable(course.mapGrading)),
    subjects: wai.prop('subjects', value, wai.nullable(wai.listOf(
      value => mapSubject(value, associations),
    ))),
    groups_count: wai.prop('groups_count', value, wai.integer),
    term_dates: wai.prop('term_dates', value, wai.listOf(
      wai.object(value => ({
        begin: wai.prop('begin', value, mapDate),
        end: wai.prop('end', value, mapDate),
      })),
    )),
  }))(value);
}

export function V3_parseRecord (
  value,
  associations: wai.Associations,
): V3_Course {
  return wai.object(record => ({
    record: wai.property(record, 'record', wai.nullable(value => parseRecordSlice(value, associations))),
    computed: wai.property(record, 'computed', wai.nullable(value => parseComputedSlice(value))),
  }))(value);
}

function parseRecordSlice (
  value,
  wai_associations: wai.Associations,
): RecordSlice {
  const associations = wai_associations as any;
  return wai.object(value => ({
    school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    project: wai.prop('project_id', value, wai.nullable(mapAssociation('projects', associations))),
    education_level: wai.prop('education_level_id', value, mapAssociation('education_levels', associations)),
    school_year: wai.prop('school_year_id', value, wai.nullable(mapAssociation('school_years', associations))),
    standardized_course: wai.prop('standardized_course_id', value, wai.nullable(mapAssociation('standardized_courses', associations))),
    name: wai.prop('name', value, mapName),
    grade: wai.prop('grade', value, wai.integer),
    is_formal: wai.prop('is_formal', value, wai.nullable(wai.boolean)),
    accreditation_authority: wai.prop('accreditation_authority', value, wai.nullable(mapSelectOrFillTuple)),
    lesson_duration: wai.prop('lesson_duration', value, wai.nullable(wai.integer)),
    attendance_limit: wai.prop('attendance_limit', value, wai.nullable(wai.integer)),
    time_ranges: wai.prop('time_ranges', value, wai.listOf(
      wai.object(value => ({
        from: wai.prop('from', value, mapDate),
        to: wai.prop('to', value, mapDate),
      })),
    )),
    preferred_grading: wai.prop('preferred_grading', value, wai.nullable(course.mapGrading)),
    groups_count: wai.prop('groups_count', value, wai.integer),
  }))(value);
}

function parseComputedSlice (value): ComputedSlice {
  return wai.object(value => ({
    term_dates: wai.prop('term_dates', value, wai.listOf(
      wai.object(value => ({
        begin: wai.prop('begin', value, mapDate),
        end: wai.prop('end', value, mapDate),
      })),
    )),
  }))(value);
}

export function mapSubject (
  value,
  associations?: RecordAssociations,
): CourseSubject {
  return wai.object(value => ({
    subject: wai.prop('subject_id', value, mapAssociation('subjects', associations)),
    grading: wai.prop('grading', value, wai.nullable(mapGrading)),
    exam: wai.prop('exam', value, wai.nullable(wai.boolean)),
  }))(value);
}

export function mapGrading (
  value: unknown,
): [string, string, undefined | string] {
  if (!Array.isArray(value)) {
    throw new wai.MappingError('not array');
  }
  const array: any = [];
  array[0] = wai.prop(0, value, wai.string);
  array[1] = wai.prop(1, value, wai.string);
  array[2] = wai.prop(2, value, wai.nullable(wai.string));
  return Object.freeze(array);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function recordControls ({
  countryData,
}: {
  countryData?: app.session.CountryData;
}): FormFieldDefinition[] {
  return [
    [ 'school', dbFields.selectBRecord, {
      entity: 'schools',
    } ],
    [ 'education_level', dbFields.selectBRecord, {
      entity: 'education_levels',
    } ],
    [ 'project', dbFields.selectBRecord, {
      entity: 'projects',
    } ],
    [ 'school_year', dbFields.selectBRecord, {
      entity: 'school_years',
    } ],
    [ 'standardized_course', dbFields.selectBRecord, {
      entity: 'standardized_courses',
    } ],
    [ 'name', controls.name ],
    [ 'grade', controls.integer, {
      maxLength: 2,
    } ],
    [ 'is_formal', controls.boolean ],
    [ 'accreditation_authority', controls.selectOrFill, {
      options: app.internalOptionsList(countryData, 'accreditation_authority'),
    } ],
    [ 'lesson_duration', controls.integer, {
      rightLabel: 'app.time.minutes.p',
    } ],
    [ 'attendance_limit', controls.integer, {
      requireable: true,
      rightLabel: { text: '%' },
    } ],
    [ 'preferred_grading', asFieldType(GradingTypeField) ],
    [ 'time_ranges', asFieldType(SchoolYearTerms) ],
    [ 'subjects', asFieldType(SubjectsField) ],
  ];
}
