import * as mappers from '~/lib/api/mappers';

export interface Group {
  id: number;
  school: mappers.AssociatedRecord;
  course: mappers.AssociatedRecord;
  name_en: string
  name: string
  year: number;
  term: number;
}

export interface GroupAssociations {
  school: mappers.AssociatedRecordsIndex,
  course: mappers.AssociatedRecordsIndex,
}

const { object, recordId, prop, assoc, val } = mappers;

export function mapTermGroup (value: any, associations?: GroupAssociations): Group {
  return object(value, root => ({
    id: recordId(root),
    school: assoc('school', root, associations?.school),
    course: assoc('course', root, associations?.course),
    name_en: prop('name_en', root, val.string),
    name: prop('name', root, val.string),
    year: prop('year', root, val.integer),
    term: prop('term', root, val.integer),
  }));
}

export const mapGroupAssociations = mappers.createAssociationsMapper<GroupAssociations>(
  'school', 'course',
);

export const group = {
  startYearOptions: Object.freeze([
    { value: 2018, caption: 2018 },
    { value: 2019, caption: 2019 },
    { value: 2020, caption: 2020 },
    { value: 2021, caption: 2021 },
    { value: 2022, caption: 2022 },
    { value: 2023, caption: 2023 },
    { value: 2024, caption: 2024 },
    { value: 2025, caption: 2025 },
    { value: 2026, caption: 2026 },
    { value: 2027, caption: 2027 },
    { value: 2028, caption: 2028 },
  ]),
};
