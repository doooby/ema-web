import * as mappers from '~/lib/api/mappers';
import { asFieldType, FormFieldDefinition } from '~/components/Form';
import AbbreviatedRecordsField from '~/components/database/AbbreviatedRecordsField.vue';

export interface School {
  id: number;
  country: mappers.AbbreviatedRecord;
  education_levels: mappers.AbbreviatedRecord[];
  name: [string, string];
  external_id: string;
  education_types: string[];
  gender_dedications: string[];
  classrooms_count: number;
  male_latrines_count: number;
  female_latrines_count: number;
}

export interface SchoolAssociations {
  country: mappers.AssociatedRecordsIndex,
  education_level: mappers.AssociatedRecordsIndex,
}

export const school = {
  mapRecord (value: any, associations?: SchoolAssociations): mappers.InvalidRecord | School {
    return mappers.safeRecord(value, record => ({
      id: mappers.recordId(record),
      country: mappers.assoc('country', record, associations?.country),
      education_levels: mappers.assocList('education_levels_ids', record, associations?.education_level),
      name: mappers.prop('name', record, mappers.val.nameTuple),
      external_id: mappers.prop('external_id', record, mappers.val.string),
      education_types: mappers.prop('education_types', record,
        education_types => mappers.list(education_types, mappers.val.string),
      ),
      gender_dedications: mappers.prop('gender_dedications', record,
        gender_dedications => mappers.list(gender_dedications, mappers.val.string),
      ),
      classrooms_count: mappers.prop('classrooms_count', record, mappers.val.integer),
      male_latrines_count: mappers.prop('male_latrines_count', record, mappers.val.integer),
      female_latrines_count: mappers.prop('female_latrines_count', record, mappers.val.integer),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SchoolAssociations>(
    'country', 'education_level',
  ),
  recordControls (): FormFieldDefinition[] {
    return [
      [ 'education_levels', asFieldType(AbbreviatedRecordsField), {
        entity: 'education_levels',
      } ],
      [ 'name', 'name' ],
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
    ];
  },
};
