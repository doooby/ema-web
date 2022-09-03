import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records/country';
import { FormFieldDefinition } from '~/components/Form';

const { object, recordId, prop, val, assoc } = mappers;

export interface SubjectCategory {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  name: [string, string];
}

export interface SubjectCategoryAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export const subjectCategory = {
  mapRecord (value: any, associations?: SubjectCategoryAssociations): SubjectCategory {
    return object(value, root => ({
      id: recordId(root),
      country: assoc('country', root, associations?.country),
      name: prop('name', root, val.nameTuple),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SubjectCategoryAssociations>(
    'country',
  ),
  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name', 'name' ],
    ];
  },
};
