import * as mappers from '~/lib/api/mappers';
import { EducationLevel } from '~/lib/records/education_level';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';

const { object, recordId, prop, assoc, val } = mappers;

export interface Course {
  id: number;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
  grade: number;
}

export interface CourseAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}

export const course = {
  mapRecord (value: any, associations?: CourseAssociations): Course {
    return object(value, root => ({
      id: recordId(root),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
      grade: prop('grade', root, val.integer),
      education_level: assoc('education_level', root, associations?.education_level),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<CourseAssociations>(
    'education_level',
  ),
  recordControls ({
    countryId,
  }: {
    countryId: null | number;
  }): FormFieldDefinition[] {
    return [
      [ 'education_level', dbFields.AssociatedRecord, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
      [ 'grade', 'integer' ],
    ];
  },
};
