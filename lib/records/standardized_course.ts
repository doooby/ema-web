import * as mappers from '~/lib/api/mappers';
import { maybeProp } from '~/lib/api/mappers';
import { course, CourseSubject, EducationLevel } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';
import { asControl } from '~/components/database/controls';
import GradingType from '~/components/database/records/courses/controls/GradingType.vue';
import CourseSubjects from '~/components/database/records/courses/controls/CourseSubjects/CourseSubjects.vue';

const { object, recordId, prop, assoc, val } = mappers;

export interface StandardizedCourse {
  id: number;
  name: [string, string];
  education_level: mappers.AssociatedRecord<EducationLevel>;
  grade: number;
  accreditation_authority: [string, undefined | string];
  lesson_duration: number;
  attendance_limit: undefined | number;
  preferred_grading: [string, string, undefined | string];
  description: undefined | string;
  subjects: CourseSubject[];
}

export interface StandardizedCourseAssociations {
  education_level: mappers.AssociatedRecordsIndex,
  subjects: mappers.AssociatedRecordsIndex,
  teachers: mappers.AssociatedRecordsIndex,
}

export const standardizedCourse = {
  mapRecord (value: any, associations?: StandardizedCourseAssociations): StandardizedCourse {
    return object(value, root => ({
      id: recordId(root),
      name: prop('name', root, val.nameTuple),
      education_level: assoc('education_level', root, associations?.education_level),
      grade: prop('grade', root, val.integer),
      accreditation_authority: prop('accreditation_authority', root, val.factories.tuple2_1(
        val.string,
        val.string,
      )),
      lesson_duration: prop('lesson_duration', root, val.integer),
      attendance_limit: maybeProp('attendance_limit', root, val.integer),
      preferred_grading: prop('preferred_grading', root, course.mapGrading),
      description: prop('description', root, val.string),
      subjects: prop('subjects', root, course.mapSubjectsFactory(associations)),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<StandardizedCourseAssociations>(
    'education_level',
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
