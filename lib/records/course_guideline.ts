import * as mappers from '~/lib/api/mappers';
import { EducationLevel } from '~/lib/records';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';

const { object, recordId, prop, assoc, val } = mappers;

export interface CourseGuideline {
  id: number;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
}

export interface CourseGuidelineAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}

export const courseGuideline = {
  mapRecord (value: any, associations?: CourseGuidelineAssociations): CourseGuideline {
    return object(value, root => ({
      id: recordId(root),
      education_level: assoc('education_level', root, associations?.education_level),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<CourseGuidelineAssociations>(
    'education_level',
  ),
  recordControls (countryId: null | number): FormFieldDefinition[] {
    return [
      [ 'education_level', dbFields.AssociatedRecord, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
    ];
  },
};
