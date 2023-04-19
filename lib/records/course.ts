import { application_record, StandardizedCourseSubject2 } from '~/lib/records';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import GradingTypeField from '~/components/database/records/courses/GradingTypeField.vue';
import SubjectsField from '~/components/database/records/courses/SubjectsField.vue';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate, mapName } from '~/lib/api2/mappers';
import { dbFields } from '~/components/database/fields';

export const entity = 'courses';

export interface Course extends application_record.SharedAttributes {
  school: BRecord;
  education_level: BRecord;
  school_year?: BRecord;
  standardized_course?: BRecord;
  name: string[];
  grade: number;
  is_formal?: boolean;
  accreditation_authority?: [string, undefined | string];
  lesson_duration?: number;
  attendance_limit?: number;
  time_ranges: { from: Date, to: Date }[];
  subjects?: CourseSubject[];
}

export interface CourseSubject extends StandardizedCourseSubject2 {
  // teacher?: BRecord;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): Course {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    education_level: wai.prop('education_level_id', value, mapAssociation('education_levels', associations)),
    school_year: wai.prop('school_year_id', value, wai.nullable(mapAssociation('school_years', associations))),
    standardized_course: wai.prop('standardized_course_id', value, wai.nullable(mapAssociation('standardized_courses', associations))),
    name: wai.prop('name', value, mapName),
    grade: wai.prop('grade', value, wai.integer),
    is_formal: wai.prop('is_formal', value, wai.nullable(wai.boolean)),
    accreditation_authority: wai.prop('accreditation_authority', value, wai.nullable(mapAccreditationAuthority)),
    lesson_duration: wai.prop('lesson_duration', value, wai.nullable(wai.integer)),
    attendance_limit: wai.prop('attendance_limit', value, wai.nullable(wai.integer)),
    time_ranges: wai.prop('time_ranges', value, wai.listOf(
      wai.object(value => ({
        from: wai.prop('from', value, mapDate),
        to: wai.prop('to', value, mapDate),
      })),
    )),
    subjects: wai.prop('subjects', value, wai.nullable(wai.listOf(
      value => mapCourseSubject(value, associations),
    ))),
  }))(value);
}

function mapAccreditationAuthority (
  value: unknown,
): [string, undefined | string] {
  if (!Array.isArray(value)) {
    throw new wai.MappingError('not array');
  }
  const array: any = [];
  array[0] = wai.prop(0, value, wai.string);
  array[2] = wai.prop(2, value, wai.nullable(wai.string));
  return Object.freeze(array);
}

function mapCourseSubject (
  value: unknown,
  associations?: RecordAssociations,
): CourseSubject {
  return wai.object(value => ({
    subject: wai.prop('subject_id', value, mapAssociation('subjects', associations)),
    grading: wai.prop('grading', value, wai.nullable(mapCourseSubjectGrading)),
    exam: wai.prop('exam', value, wai.nullable(wai.boolean)),
  }))(value);
}

function mapCourseSubjectGrading (
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

export function recordControls (): FormFieldDefinition[] {
  return [
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
    [ 'education_level', dbFields.selectBRecord, { entity: 'education_levels' } ],
    [ 'school_year', dbFields.selectBRecord, { entity: 'school_years' } ],
    [ 'standardized_course', dbFields.selectBRecord, { entity: 'standardized_courses' } ],
    [ 'name', controls.name ],
    [ 'grade', controls.integer, { maxLength: 2 } ],
    [ 'is_formal', controls.boolean ],
    [ 'accreditation_authority', controls.selectOrFill ],
    [ 'lesson_duration', controls.integer, { rightLabel: 'app.time.minutes.p' } ],
    [ 'attendance_limit', controls.integer, { requireable: true, rightLabel: { text: '%' } } ],
    [ 'preferred_grading', asFieldType(GradingTypeField) ],
    [ 'description', controls.textMultiline ],
    [ 'time_ranges', asFieldType(SchoolYearTerms) ],
    // [ 'subjects', asFieldType(SubjectsField) ],
  ];
}
