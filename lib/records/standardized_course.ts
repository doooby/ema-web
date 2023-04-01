import * as mappers from '~/lib/api/mappers';
import { course, Subject } from '~/lib/records';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import GradingTypeField from '~/components/database/records/courses/GradingTypeField.vue';
import SubjectsField from '~/components/database/records/standardized_courses/SubjectsField.vue';
import AbbreviatedRecordField from '~/components/database/records/AbbreviatedRecordField.vue';

const { object, recordId, prop, maybeProp, assoc, val } = mappers;

export interface StandardizedCourse {
  id: number;
  name: [string, string];
  education_level: mappers.AssociatedRecord;
  grade: number;
  is_formal: boolean;
  accreditation_authority?: [string, undefined | string];
  lesson_duration?: number;
  attendance_limit?: number;
  preferred_grading?: [string, string, undefined | string];
  description?: string;
  subjects?: StandardizedCourseSubject[];
}

export interface StandardizedCourseAssociations {
  education_level: mappers.AssociatedRecordsIndex,
  subject: mappers.AssociatedRecordsIndex,
}

export interface StandardizedCourseSubject {
  subject: mappers.AssociatedRecord<Subject>;
  grading?: [string, string, undefined | string];
  exam?: boolean;
}

export const standardizedCourse = {
  mapRecord (value: any, associations?: StandardizedCourseAssociations): StandardizedCourse {
    return object(value, root => ({
      id: recordId(root),
      name: prop('name', root, val.nameTuple),
      education_level: assoc('education_level', root, associations?.education_level),
      grade: prop('grade', root, val.integer),
      is_formal: prop('is_formal', root, val.boolean),
      accreditation_authority: maybeProp('accreditation_authority', root, val.factories.tuple2_1(
        val.string,
        val.string,
      )),
      lesson_duration: maybeProp('lesson_duration', root, val.integer),
      attendance_limit: maybeProp('attendance_limit', root, val.integer),
      preferred_grading: maybeProp('preferred_grading', root, course.mapGrading),
      description: prop('description', root, val.string),
      subjects: maybeProp('subjects', root, standardizedCourse.mapSubjectsFactory(associations)),
    }));
  },
  mapSubjectsFactory: (associations?: {
    subject: mappers.AssociatedRecordsIndex,
  }): (value: any) => StandardizedCourseSubject[] => val.factories.listOfObjects((item) => {
    return {
      subject: assoc('subject', item, associations?.subject),
      grading: maybeProp('grading', item, course.mapGrading),
      exam: maybeProp('exam', item, val.boolean),
    };
  }),
  mapAssociations: mappers.createAssociationsMapper<StandardizedCourseAssociations>(
    'education_level', 'subject',
  ),
  recordControls (countryId: null | number): FormFieldDefinition[] {
    return [
      [ 'name', controls.name ],
      [ 'education_level', asFieldType(AbbreviatedRecordField), {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
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
      [ 'subjects', asFieldType(SubjectsField) ],
    ];
  },
};
