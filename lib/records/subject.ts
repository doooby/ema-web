import * as mappers from '~/lib/api/mappers';
import { FormFieldDefinition } from '~/components/Form';
import { EducationLevel, SubjectCategory } from '~/lib/records';
import * as dbFields from '~/components/database/controls';
import { assocList } from '~/lib/api/mappers';

const { object, recordId, prop, val, assoc } = mappers;

export interface Subject {
  id: number;
  education_level: mappers.AssociatedRecord<EducationLevel>;
  name_en: string;
  name: string;
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
      education_level: assoc('education_level', root, associations?.education_level),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
      categories: assocList('categories', root, associations?.subject_category),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SubjectAssociations>(
    'education_level',
    'subject_category',
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
      [ 'categories', dbFields.MultipleAssociatedRecords, {
        entity: 'subject_categories',
        params: {
          country_id: countryId,
        },
      } ],
    ];
  },
};
