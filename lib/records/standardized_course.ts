import { application_record, course } from '~/lib/records';
import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapName } from '~/lib/api2/mappers';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import GradingTypeField from '~/components/database/records/courses/GradingTypeField.vue';
import SubjectsField from '~/components/database/records/courses/SubjectsField.vue';

export const entity = 'standardized_courses';

export interface StandardizedCourse extends application_record.SharedAttributes {
  name: string[];
  education_level: BRecord;
  grade: number;
  is_formal?: boolean;
  accreditation_authority?: [string, undefined | string];
  lesson_duration?: number;
  attendance_limit?: number;
  preferred_grading?: [string, string, undefined | string];
  description?: string;
  subjects?: course.CourseSubject[];
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): StandardizedCourse {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    education_level: wai.prop('education_level_id', value, mapAssociation('education_levels', associations)),
    name: wai.prop('name', value, mapName),
    grade: wai.prop('grade', value, wai.integer),
    is_formal: wai.prop('is_formal', value, wai.nullable(wai.boolean)),
    accreditation_authority: wai.prop('accreditation_authority', value, wai.nullable(course.mapAccreditationAuthority)),
    lesson_duration: wai.prop('lesson_duration', value, wai.nullable(wai.integer)),
    attendance_limit: wai.prop('attendance_limit', value, wai.nullable(wai.integer)),
    preferred_grading: wai.prop('preferred_grading', value, wai.nullable(course.mapGrading)),
    description: wai.prop('description', value, wai.nullable(wai.string)),
    subjects: wai.prop('subjects', value, wai.nullable(wai.listOf(
      value => course.mapSubject(value, associations),
    ))),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function recordControls (): FormFieldDefinition[] {
  return [
    [ 'education_level', dbFields.selectBRecord, { entity: 'education_levels' } ],
    [ 'name', controls.name ],
    [ 'grade', controls.integer, { maxLength: 2 } ],
    [ 'is_formal', controls.boolean ],
    [ 'accreditation_authority', controls.selectOrFill ],
    [ 'lesson_duration', controls.integer, { rightLabel: 'app.time.minutes.p' } ],
    [ 'attendance_limit', controls.integer, { requireable: true, rightLabel: { text: '%' } } ],
    [ 'preferred_grading', asFieldType(GradingTypeField) ],
    [ 'description', controls.textMultiline ],
    [ 'subjects', asFieldType(SubjectsField) ],
  ];
}
