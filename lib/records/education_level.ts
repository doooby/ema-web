import * as mp from '~/lib/api/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';

export interface EducationLevel {
  id: number;
  country: mp.AbbreviatedRecord;
  name: [string, string];
  level: number;
}

export interface EducationLevelAssociations {
  country: mp.AssociatedRecordsIndex,
}

export const educationLevel = {
  mapRecord (value: any, associations?: EducationLevelAssociations): mp.InvalidRecord | EducationLevel {
    return mp.safeRecord(value, root => ({
      id: mp.recordId(root),
      country: mp.assoc('country', root, associations?.country),
      name: mp.prop('name', root, mp.val.nameTuple),
      level: mp.prop('level', root, mp.val.integer),
    }));
  },

  mapAssociations: mp.createAssociationsMapper<EducationLevelAssociations>(
    'country',
  ),

  recordControls (): FormFieldDefinition[] {
    return [
      [ 'level', controls.integer ],
      [ 'name', controls.name ],
    ];
  },

};
