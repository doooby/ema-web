import * as mappers from '~/lib/api/mappers';
import { MappingError } from '~/lib/api/mappers';
import { EducationLevel, Person, School, SchoolYear, StandardizedCourse, Subject } from '~/lib/records';
import { asFieldType, FormFieldDefinition } from '~/components/Form';
import GradingTypeField from '~/components/database/records/courses/GradingTypeField.vue';
import SubjectsField from '~/components/database/records/courses/SubjectsField.vue';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import AbbreviatedRecordField from '~/components/database/records/AbbreviatedRecordField.vue';

const { recordId, prop, assoc, val, maybeAssoc, maybeProp } = mappers;

export interface Course {
  id: number;
  school: mappers.AssociatedRecord<School>;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  school_year: undefined | mappers.AssociatedRecord<SchoolYear>;
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

export interface CourseSubject {
  subject: mappers.AssociatedRecord<Subject>;
  teacher?: mappers.AssociatedRecord<Person>;
  grading?: [string, string, undefined | string];
  exam?: boolean;
}

export const course = {
  mapRecord (value: any, associations?: CourseAssociations): mappers.InvalidRecord | Course {
    try {
      return mappers.object(value, root => ({
        id: recordId(root),
        name: prop('name', root, val.nameTuple),
        school: assoc('school', root, associations?.school),
        education_level: assoc('education_level', root, associations?.education_level),
        school_year: maybeAssoc('school_year', root, associations?.school_year),
        standardized_course: maybeAssoc('standardized_course', root, associations?.standardized_course),
        grade: prop('grade', root, val.integer),
        is_formal: prop('is_formal', root, val.boolean),
        accreditation_authority: maybeProp('accreditation_authority', root, val.factories.tuple2_1(
          val.string,
          val.string,
        )),
        lesson_duration: maybeProp('lesson_duration', root, val.integer),
        attendance_limit: maybeProp('attendance_limit', root, val.integer),
        time_ranges: prop('time_ranges', root, time_ranges => mappers.list(
          time_ranges,
          time_range => mappers.object(time_range, object => ({
            from: prop('from', object, val.date),
            to: prop('to', object, val.date),
          })),
        )),
        subjects: maybeProp('subjects', root, course.mapSubjectsFactory(associations)),
      }));
    } catch (error) {
      if (error instanceof MappingError) error.finalize();
      utils.warnOfError(error);
      return mappers.object(value, root => ({
        id: recordId(root),
        __invalid: true,
        __invalidRecord: {
          error,
          src: root,
        },
      }));
    }
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
      [ 'name', 'name' ],
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
};
