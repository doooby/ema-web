import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import AbbreviatedRecordsField from '~/components/database/AbbreviatedRecordsField.vue';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';

export function all (): FormFieldDefinition[] {
  return [
    [ 'name', controls.name ],
    [ 'education_levels', asFieldType(AbbreviatedRecordsField), {
      entity: 'education_levels',
    } ],
    [ 'terms', asFieldType(SchoolYearTerms) ],
  ];
}
