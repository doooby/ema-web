import * as mappers from '~/lib/api/mappers';
import { EducationLevel, Person, School, Subject } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';

const { object, recordId, prop, assoc, val, maybeAssoc } = mappers;

export interface Course {
  id: number;
  school: mappers.AssociatedRecord<School>;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
  grade: number;
  // subjects: CourseSubject[];
}

export interface CourseAssociations {
  school: mappers.AssociatedRecordsIndex,
  education_level: mappers.AssociatedRecordsIndex,
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
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
      grade: prop('grade', root, val.integer),
      school: assoc('school', root, associations?.school),
      education_level: assoc('education_level', root, associations?.education_level),
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
    subjects: mappers.AssociatedRecordsIndex,
    teachers: mappers.AssociatedRecordsIndex,
  }): (value: any) => CourseSubject[] => val.factories.listOfObjects(item => ({
    subject: assoc('subject', item, associations?.subjects),
    teacher: maybeAssoc('teacher', item, associations?.teachers),
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
