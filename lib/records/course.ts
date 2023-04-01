import * as mappers from '~/lib/api/mappers';
import {
  person,
  School,
  StandardizedCourse,
  StandardizedCourseSubject,
} from '~/lib/records';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import GradingTypeField from '~/components/database/records/courses/GradingTypeField.vue';
import SubjectsField from '~/components/database/records/courses/SubjectsField.vue';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import AbbreviatedRecordField from '~/components/database/records/AbbreviatedRecordField.vue';

const { recordId, prop, assoc, val, maybeAssoc, maybeProp } = mappers;

export interface Course {
  id: number;
  school: mappers.AssociatedRecord<School>;
  education_level: mappers.AssociatedRecord;
  school_year: undefined | mappers.AssociatedRecord;
  standardized_course: undefined | mappers.AssociatedRecord<StandardizedCourse>;
  name: [string, string];
  grade: number;
  is_formal: boolean;
  accreditation_authority: undefined | [string, undefined | string];
  lesson_duration: undefined | number;
  attendance_limit: undefined | number;
  time_ranges: { from: Date, to: Date }[];
  subjects: undefined | CourseSubject[];
}

export interface CourseAssociations {
  school: mappers.AssociatedRecordsIndex,
  education_level: mappers.AssociatedRecordsIndex,
  school_year: mappers.AssociatedRecordsIndex,
  standardized_course: mappers.AssociatedRecordsIndex,
  subject: mappers.AssociatedRecordsIndex,
  teacher: mappers.AssociatedRecordsIndex,
}

export interface CourseSubject extends StandardizedCourseSubject {
  teacher?: mappers.AssociatedRecord<person.Person>;
}

export const course = {
  mapRecord (value: any, associations?: CourseAssociations): mappers.InvalidRecord | Course {
    return mappers.safeRecord(value, record => ({
      id: recordId(record),
      name: prop('name', record, val.nameTuple),
      school: assoc('school', record, associations?.school),
      education_level: assoc('education_level', record, associations?.education_level),
      school_year: maybeAssoc('school_year', record, associations?.school_year),
      standardized_course: maybeAssoc('standardized_course', record, associations?.standardized_course),
      grade: prop('grade', record, val.integer),
      is_formal: prop('is_formal', record, val.boolean),
      accreditation_authority: maybeProp('accreditation_authority', record, val.factories.tuple2_1(
        val.string,
        val.string,
      )),
      lesson_duration: maybeProp('lesson_duration', record, val.integer),
      attendance_limit: maybeProp('attendance_limit', record, val.integer),
      time_ranges: prop('time_ranges', record, time_ranges => mappers.list(
        time_ranges,
        time_range => mappers.object(time_range, object => ({
          from: prop('from', object, val.date),
          to: prop('to', object, val.date),
        })),
      )),
      subjects: maybeProp('subjects', record, course.mapSubjectsFactory(associations)),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<CourseAssociations>(
    'school',
    'education_level',
    'school_year',
    'standardized_course',
    'subject',
    'teacher',
  ),
  mapGrading: val.factories.tuple3_2(
    val.string,
    val.string,
    val.string,
  ),
  mapSubjectsFactory: (associations?: {
    subject: mappers.AssociatedRecordsIndex,
    teacher: mappers.AssociatedRecordsIndex,
  }): (value: any) => CourseSubject[] => val.factories.listOfObjects(item => ({
    subject: assoc('subject', item, associations?.subject),
    teacher: maybeAssoc('teacher', item, associations?.teacher),
    grading: maybeProp('grading', item, course.mapGrading),
    exam: maybeProp('exam', item, val.boolean),
  })),
  recordControls ({
    countryId,
  }: {
    countryId: null | number;
  }): FormFieldDefinition[] {
    return [
      [ 'school', asFieldType(AbbreviatedRecordField), {
        entity: 'schools',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'education_level', asFieldType(AbbreviatedRecordField), {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'school_year', asFieldType(AbbreviatedRecordField), {
        entity: 'school_years',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'standardized_course', asFieldType(AbbreviatedRecordField), {
        entity: 'standardized_courses',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'name', controls.name ],
      [ 'grade', 'integer', { maxLength: 2 } ],
      [ 'is_formal', 'boolean' ],
      [ 'accreditation_authority', 'selectOrFill', {
        options: course.accreditationAuthorityOptions(),
      } ],
      [ 'lesson_duration', 'integer', { rightLabel: 'app.time.minutes.p' } ],
      [ 'attendance_limit', 'integer', {
        requireable: true,
        rightLabel: { text: '%' },
      } ],
      [ 'preferred_grading', asFieldType(GradingTypeField) ],
      [ 'description', 'textMultiline' ],
      [ 'time_ranges', asFieldType(SchoolYearTerms) ],
      [ 'subjects', asFieldType(SubjectsField) ],
    ];
  },
  accreditationAuthorityOptions () {
    return Object.freeze([
      { value: 'gov', text: 'db.record.courses.accreditation_authority.gov' },
      { value: 'ngo', text: 'db.record.courses.accreditation_authority.ngo' },
    ]);
  },
  updateFormPerStandardizedCourse (values: any, record: StandardizedCourse) {
    const {
      name,
      education_level,
      grade,
      is_formal,
      accreditation_authority,
      lesson_duration,
      attendance_limit,
      preferred_grading,
      subjects,
    } = record;
    return {
      ...values,
      name,
      education_level,
      grade,
      is_formal,
      accreditation_authority,
      lesson_duration,
      attendance_limit,
      preferred_grading,
      subjects,
    };
  },
};
