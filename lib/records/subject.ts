import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records/country';
import { assoc } from '~/lib/api/mappers';
import { FormFieldDefinition } from '~/components/Form';

const { object, recordId, prop, val } = mappers;

export interface Subject {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  name_en: string;
  name: string;
}

export interface SubjectAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export const subject = {
  mapRecord (value: any, associations?: SubjectAssociations): Subject {
    return object(value, root => ({
      id: recordId(root),
      country: assoc('country', root, associations?.country),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SubjectAssociations>(
    'country',
  ),
  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
    ];
  },
};
