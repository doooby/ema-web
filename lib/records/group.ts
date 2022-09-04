import * as mappers from '~/lib/api/mappers';
import { asFieldType, FormFieldDefinition } from '~/components/Form';
import { AssociatedRecord, list, tuple } from '~/lib/api/mappers';
import { Subject } from '~/lib/records/subject';
import AssociatedRecordField from '~/components/database/records/AssociatedRecordField.vue';

export interface Group {
  id: number;
  course: mappers.AssociatedRecord;
  name_en: string
  name: string
  term: number;
}

export interface GroupAssociations {
  course: mappers.AssociatedRecordsIndex,
}

export namespace GroupSchedule {
  export interface Definition {
    subjects: Record<string, AssociatedRecord<Subject>>;
    settings: any;
    occurrences: SubjectOccurrence[];
  }
  export interface SubjectOccurrence {
    subject: AssociatedRecord<Subject>;
    date: Date;
  }
}

const { object, recordId, prop, assoc, val } = mappers;

export const group = {
  mapRecord (value: any, associations?: GroupAssociations): Group {
    return object(value, root => ({
      id: recordId(root),
      course: assoc('course', root, associations?.course),
      name_en: prop('name_en', root, val.string),
      name: prop('name', root, val.string),
      term: prop('term', root, val.integer),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<GroupAssociations>(
    'course',
  ),
  recordControls ({
    countryId,
  }: {
    countryId: null | number;
  }): FormFieldDefinition[] {
    return [
      [ 'course', asFieldType(AssociatedRecordField), {
        entity: 'courses',
        params: {
          country_id: countryId,
        },
      } ],
      [ 'name_en', 'text' ],
      [ 'name', 'text' ],
      [ 'term', 'integer' ],
    ];
  },
  startYearOptions: Object.freeze([
    { value: 2018, text: 2018 },
    { value: 2019, text: 2019 },
    { value: 2020, text: 2020 },
    { value: 2021, text: 2021 },
    { value: 2022, text: 2022 },
    { value: 2023, text: 2023 },
    { value: 2024, text: 2024 },
    { value: 2025, text: 2025 },
    { value: 2026, text: 2026 },
    { value: 2027, text: 2027 },
    { value: 2028, text: 2028 },
  ]),
};

export function mapScheduleOccurrences (value: any): [number, Date][] {
  return list(value, item => tuple(item, itemValues => [
    prop('0', itemValues, val.id),
    prop('1', itemValues, val.date),
  ]));
}
