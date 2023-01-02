import * as mp from '~/lib/api/mappers';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import AbbreviatedRecordsField from '~/components/database/AbbreviatedRecordsField.vue';

export interface Project {
  id: number;
  country: mp.AbbreviatedRecord;
  name: [string, string];
  code?: string;
  starts_on?: Date;
  ends_on?: Date;
  donors?: string;
  schools?: mp.AbbreviatedRecord[];
}

export interface ProjectAssociations {
  country: mp.AssociatedRecordsIndex,
  school: mp.AssociatedRecordsIndex,
}

export const project = {

  mapRecord (value: any, associations?: ProjectAssociations): mp.InvalidRecord | Project {
    return mp.safeRecord(value, root => ({
      id: mp.recordId(root),
      country: mp.assoc('country', root, associations?.country),
      name: mp.prop('name', root, mp.val.nameTuple),
      code: mp.maybeProp('code', root, mp.val.string),
      starts_on: mp.maybeProp('starts_on', root, mp.val.date),
      ends_on: mp.maybeProp('ends_on', root, mp.val.date),
      donors: mp.maybeProp('donors', root, mp.val.string),
      schools: mp.assocList('schools_ids', root, associations?.school),
    }));
  },

  mapAssociations: mp.createAssociationsMapper<ProjectAssociations>(
    'country',
    'school',
  ),

  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name', controls.name ],
      [ 'code', controls.text ],
      [ 'starts_on', controls.calendar ],
      [ 'ends_on', controls.calendar ],
      [ 'donors', controls.textMultiline ],
      [ 'schools', asFieldType(AbbreviatedRecordsField), {
        entity: 'schools',
      } ],
    ];
  },

};
