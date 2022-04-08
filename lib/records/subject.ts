import * as mappers from '~/lib/api/mappers';
import { FormFieldDefinition } from '~/components/Form';
import { CourseAssociations, EducationLevel } from '~/lib/records';
import * as dbFields from '~/components/database/controls';

const { object, recordId, prop, val, assoc } = mappers;

export interface Subject {
  id: number;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
}

export interface SubjectAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}

export const subject = {
  mapRecord (value: any, associations?: SubjectAssociations): Subject {
    return object(value, root => ({
      id: recordId(root),
      education_level: assoc('education_level', root, associations?.education_level),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<CourseAssociations>(
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
