import * as mappers from '~/lib/api/mappers';
import { assocList } from '~/lib/api/mappers';
import { asFieldType, FormFieldDefinition } from '~/components/Form';
import { EducationLevel, SubjectCategory } from '~/lib/records';
import AbbreviatedRecordsField from '~/components/database/AbbreviatedRecordsField.vue';

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
  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name', 'name' ],
      [ 'education_levels', asFieldType(AbbreviatedRecordsField), {
        entity: 'education_levels',
      } ],
      [ 'categories', asFieldType(AbbreviatedRecordsField), {
        entity: 'subject_categories',
      } ],
    ];
  },
};
