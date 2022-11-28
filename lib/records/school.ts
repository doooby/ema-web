import * as mappers from '~/lib/api/mappers';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import AbbreviatedRecordsField from '~/components/database/AbbreviatedRecordsField.vue';

export interface School {
  address?: string[];
  id: number;
  classrooms_count: number;
  country: mappers.AbbreviatedRecord;
  director?: mappers.AbbreviatedRecord;
  education_levels: mappers.AbbreviatedRecord[];
  education_types: string[];
  external_id: string;
  female_latrines_count: number;
  gender_dedications: string[];
  male_latrines_count: number;
  name: [string, string];
}

export interface SchoolAssociations {
  country: mappers.AssociatedRecordsIndex,
  education_level: mappers.AssociatedRecordsIndex,
  director: mappers.AssociatedRecordsIndex,
}

export const school = {
  mapRecord (value: any, associations?: SchoolAssociations): mappers.InvalidRecord | School {
    return mappers.safeRecord(value, record => ({
      address: mappers.maybeProp('address', record,
        education_types => mappers.list(education_types, mappers.val.string),
      ),
      id: mappers.recordId(record),
      classrooms_count: mappers.prop('classrooms_count', record, mappers.val.integer),
      country: mappers.assoc('country', record, associations?.country),
      director: mappers.maybeAssoc('director', record, associations?.director),
      education_levels: mappers.assocList('education_levels_ids', record, associations?.education_level),
      education_types: mappers.prop('education_types', record,
        education_types => mappers.list(education_types, mappers.val.string),
      ),
      external_id: mappers.prop('external_id', record, mappers.val.string),
      female_latrines_count: mappers.prop('female_latrines_count', record, mappers.val.integer),
      gender_dedications: mappers.prop('gender_dedications', record,
        gender_dedications => mappers.list(gender_dedications, mappers.val.string),
      ),
      male_latrines_count: mappers.prop('male_latrines_count', record, mappers.val.integer),
      name: mappers.prop('name', record, mappers.val.nameTuple),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SchoolAssociations>(
    'country', 'education_level', 'director',
  ),
  recordControls (addressOptions?: any): FormFieldDefinition[] {
    return [
      [ 'education_levels', asFieldType(AbbreviatedRecordsField), {
        entity: 'education_levels',
      } ],
      [ 'name', controls.name ],
      [ 'external_id', 'text' ],
      [ 'education_types', 'listMultiple', {
        options: Object.freeze([
          { value: 'formal', text: 'db.common.formal_education' },
          { value: 'informal', text: 'db.common.informal_education' },
        ]),
      } ],
      [ 'gender_dedications', 'listMultiple', {
        options: Object.freeze([
          { value: 'm', text: 'db.common.genders.boys.p' },
          { value: 'f', text: 'db.common.genders.girls.p' },
        ]),
      } ],
      [ 'classrooms_count', 'integer' ],
      [ 'male_latrines_count', 'integer' ],
      [ 'female_latrines_count', 'integer' ],
      [ 'address', 'location', addressOptions ],
    ];
  },
};
