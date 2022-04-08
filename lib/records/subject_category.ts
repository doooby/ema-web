import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records/country';
import { FormFieldDefinition } from '~/components/Form';

const { object, recordId, prop, val, assoc } = mappers;

export interface SubjectCategory {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  name_en: string;
  name: string;
}

export interface SubjectCategoryAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export const subjectCategory = {
  mapRecord (value: any, associations?: SubjectCategoryAssociations): SubjectCategory {
    return object(value, root => ({
      id: recordId(root),
      country: assoc('country', root, associations?.country),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SubjectCategoryAssociations>(
    'country',
  ),
  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
    ];
  },
};
