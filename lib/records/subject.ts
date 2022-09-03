import * as mappers from '~/lib/api/mappers';
import { assocList } from '~/lib/api/mappers';
import { FormFieldDefinition } from '~/components/Form';
import { EducationLevel, SubjectCategory } from '~/lib/records';
import * as dbFields from '~/components/database/controls';

const { object, recordId, prop, val } = mappers;

export interface Subject {
  id: number;
  name: [string, string];
  education_levels: mappers.AssociatedRecord<EducationLevel>[];
  categories: mappers.AssociatedRecord<SubjectCategory>[];
}

export interface SubjectAssociations {
  education_level: mappers.AssociatedRecordsIndex,
  subject_category: mappers.AssociatedRecordsIndex,
}

export const subject = {
  mapRecord (value: any, associations?: SubjectAssociations): Subject {
    return object(value, root => ({
      id: recordId(root),
      name: prop('name', root, val.nameTuple),
      education_levels: assocList('education_levels', root, associations?.education_level),
      categories: assocList('categories', root, associations?.subject_category),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SubjectAssociations>(
    'education_level',
    'subject_category',
  ),
  recordControls (countryId: null | number): FormFieldDefinition[] {
    return [
      [ 'name', 'name' ],
      [ 'education_levels', dbFields.MultipleAssociatedRecords, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'categories', dbFields.MultipleAssociatedRecords, {
        entity: 'subject_categories',
        params: {
          country_id: countryId,
        },
      } ],
    ];
  },
};
