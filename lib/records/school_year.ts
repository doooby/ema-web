import * as mappers from '~/lib/api/mappers';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import { EducationLevel } from '~/lib/records/education_level';
import { assocList } from '~/lib/api/mappers';
import { asControl } from '~/components/database/controls';

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
  recordControls ({
    countryId,
  }: {
    countryId: null | number;
  }): FormFieldDefinition[] {
    return [
      [ 'name', 'name' ],
      [ 'education_levels', dbFields.MultipleAssociatedRecords, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'terms', asControl(SchoolYearTerms) ],
    ];
  },
};
