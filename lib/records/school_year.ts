import * as mappers from '~/lib/api/mappers';
import { FormFieldDefinition } from '~/components/Form';
import * as dbFields from '~/components/database/controls';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';

const { object, recordId, prop, maybeAssoc, val } = mappers;

export interface SchoolYear {
  id: number;
  education_level?: mappers.AssociatedRecord;
  name_en: string;
  name: string;
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
      education_level: maybeAssoc('education_level', root, associations?.education_level),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
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
      [ 'education_level', dbFields.AssociatedRecord, {
        entity: 'education_levels',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
      [ 'terms', SchoolYearTerms.asControl ],
    ];
  },
};
