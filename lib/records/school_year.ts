import * as mappers from '~/lib/api/mappers';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import { EducationLevel } from '~/lib/records/education_level';
import { assocList } from '~/lib/api/mappers';
import AbbreviatedRecordsField from '~/components/database/AbbreviatedRecordsField.vue';

const { object, recordId, prop, val } = mappers;

export interface SchoolYear {
  id: number;
  name: [string, string];
  education_levels: mappers.AssociatedRecord<EducationLevel>[];
  year_label: string;
  terms: { from: Date, to: Date }[];
}

export interface SchoolYearAssociations {
  education_level: mappers.AssociatedRecordsIndex,
}

export const schoolYear = {
  mapRecord (value: any, associations?: SchoolYearAssociations): SchoolYear {
    return object(value, root => ({
      id: recordId(root),
      name: prop('name', root, val.nameTuple),
      education_levels: assocList('education_levels', root, associations?.education_level),
      year_label: prop('year_label', root, val.string),
      terms: prop('terms', root, val.factories.listOfObjects(
        term => ({
          from: prop('from', term, val.date),
          to: prop('from', term, val.date),
        }),
      )),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<SchoolYearAssociations>(
    'education_level',
  ),
  recordControls (): FormFieldDefinition[] {
    return [
      [ 'name', controls.name ],
      [ 'education_levels', asFieldType(AbbreviatedRecordsField), {
        entity: 'education_levels',
      } ],
      [ 'terms', asFieldType(SchoolYearTerms) ],
    ];
  },
};
