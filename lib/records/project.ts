import * as mappers from '~/lib/api/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';

export interface Project {
  id: number;
  country: mappers.AbbreviatedRecord;
  name: [string, string];
}

export interface ProjectAssociations {
  country: mappers.AssociatedRecordsIndex,
}

export const project = {

  mapRecord (value: any, associations?: ProjectAssociations): Project {
    return mappers.object(value, root => ({
      id: mappers.recordId(root),
      country: mappers.assoc('country', root, associations?.country),
      name: mappers.prop('name', root, mappers.val.nameTuple),
    }));
  },

  mapAssociations: mappers.createAssociationsMapper<ProjectAssociations>(
    'country',
  ),

  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name', controls.name ],
    ];
  },

};
