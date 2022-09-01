import * as mappers from '~/lib/api/mappers';
import { maybeProp } from '~/lib/api/mappers';
import { course, EducationLevel, Subject } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';
import { asControl } from '~/components/database/controls';
import GradingType from '~/components/database/controls/Course/GradingType.vue';
import CourseSubjects from '~/components/database/controls/CourseSubjects/CourseSubjects.vue';

const { object, recordId, prop, assoc, val } = mappers;

export interface StandardizedCourse {
  id: number;
  name: [string, string];
  education_level: mappers.AssociatedRecord<EducationLevel>;
  grade: number;
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
  grading: [string, string, undefined | string];
  exam: boolean;
}

export const standardizedCourse = {
  mapRecord (value: any, associations?: StandardizedCourseAssociations): StandardizedCourse {
    return object(value, root => ({
      id: recordId(root),
      name: prop('name', root, val.nameTuple),
      education_level: assoc('education_level', root, associations?.education_level),
      grade: prop('grade', root, val.integer),
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
      grading: prop('grading', item, course.mapGrading),
      exam: prop('exam', item, val.boolean),
    };
  }),
  mapAssociations: mappers.createAssociationsMapper<StandardizedCourseAssociations>(
    'education_level', 'subject',
  ),
  recordControls (countryId: null | number): FormFieldDefinition[] {
    return [
      [ 'name', 'name' ],
      [ 'education_level', dbFields.AssociatedRecord, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'grade', 'integer', { maxLength: 2 } ],
      [ 'accreditation_authority', 'selectOrFill', {
        options: standardizedCourse.accreditationAuthorityOptions(),
      } ],
      [ 'lesson_duration', 'integer', { rightLabel: 'app.time.minutes.p' } ],
      [ 'attendance_limit', 'integer', {
        requireable: true,
        rightLabel: { text: '%' },
      } ],
      [ 'preferred_grading', asControl(GradingType) ],
      [ 'description', 'textMultiline' ],
      [ 'subjects', asControl(CourseSubjects) ],
    ];
  },
  accreditationAuthorityOptions () {
    return Object.freeze([
      { value: 'gov', text: 'db.record.standardized_courses.accreditation_authority.gov' },
      { value: 'ngo', text: 'db.record.standardized_courses.accreditation_authority.ngo' },
    ]);
  },
};
