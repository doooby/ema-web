import * as mappers from '~/lib/api/mappers';
import { EducationLevel, Person, School, SchoolYear, Subject } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';
import { maybeProp, tuple } from '~/lib/api/mappers';

const { object, recordId, prop, assoc, val, maybeAssoc } = mappers;

export interface Course {
  id: number;
  school: mappers.AssociatedRecord<School>;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  school_year: undefined | mappers.AssociatedRecord<SchoolYear>;
  name: [string, string];
  grade: number;
  accreditation_authority: undefined | [string, undefined | string];
  lesson_duration: undefined | number;
  attendance_limit: undefined | number;
  time_range: [Date, Date];
  subjects: undefined | CourseSubject[];
}

export interface CourseAssociations {
  school: mappers.AssociatedRecordsIndex,
  education_level: mappers.AssociatedRecordsIndex,
  school_year: mappers.AssociatedRecordsIndex,
  subject: mappers.AssociatedRecordsIndex,
  teacher: mappers.AssociatedRecordsIndex,
}

export interface CourseSubject {
  subject: mappers.AssociatedRecord<Subject>;
  teacher?: mappers.AssociatedRecord<Person>;
  grading: [string, string, undefined | string];
  exam: boolean;
}

export const course = {
  mapRecord (value: any, associations?: CourseAssociations): Course {
    return object(value, root => ({
      id: recordId(root),
      name: prop('name', root, val.nameTuple),
      school: assoc('school', root, associations?.school),
      education_level: assoc('education_level', root, associations?.education_level),
      school_year: maybeAssoc('school_year', root, associations?.school_year),
      grade: prop('grade', root, val.integer),
      accreditation_authority: maybeProp('accreditation_authority', root, val.factories.tuple2_1(
        val.string,
        val.string,
      )),
      lesson_duration: maybeProp('lesson_duration', root, val.integer),
      attendance_limit: maybeProp('attendance_limit', root, val.integer),
      time_range: prop('time_range', root, timeRange => tuple(timeRange, array => [
        prop('0', array, val.date),
        prop('1', array, val.date),
      ])),
      subjects: maybeProp('subjects', root, course.mapSubjectsFactory(associations)),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<CourseAssociations>(
    'school',
    'education_level',
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
    grading: prop('grading', item, course.mapGrading),
    exam: prop('exam', item, val.boolean),
  })),
  recordControls ({
    countryId,
  }: {
    countryId: null | number;
  }): FormFieldDefinition[] {
    return [
      [ 'school', dbFields.AssociatedRecord, {
        entity: 'schools',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'education_level', dbFields.AssociatedRecord, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'grade', 'integer' ],
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
    ];
  },
};
