import * as mappers from '~/lib/api/mappers';
import { EducationLevel, School } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';

const { object, recordId, prop, assoc, val } = mappers;

export interface Course {
  id: number;
  school: mappers.AssociatedRecord<School>;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
  grade: number;
}

export interface CourseAssociations {
  school: mappers.AssociatedRecordsIndex,
  education_level: mappers.AssociatedRecordsIndex,
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
