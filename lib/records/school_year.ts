import * as mappers from '~/lib/api/mappers';

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
};
