import * as mappers from '~/lib/api/mappers';
import { FormFieldDefinition } from '~/components/Form';

const { object, recordId, prop, assoc, val } = mappers;

export interface School {
  id: number;
  country: mappers.AssociatedRecord;
  name: [string, string];
  school_id: string;
}

export interface SchoolAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export const school = {
  mapRecord (value: any, associations?: SchoolAssociations): School {
    return object(value, root => ({
      id: recordId(root),
      country: assoc('country', root, associations?.country),
      name: prop('name', root, val.nameTuple),
      school_id: prop('school_id', root, val.string),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SchoolAssociations>(
    'country',
  ),
  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name', 'name' ],
      [ 'school_id', 'text' ],
    ];
  },
};
