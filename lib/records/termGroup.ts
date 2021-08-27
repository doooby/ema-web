import * as mappers from '~/lib/api/mappers';

export interface TermGroup {
  id: number;
  name: string
  year_start: number;
  term?: number;
  school: mappers.AssociatedRecord;
  course: mappers.AssociatedRecord;
}

export interface TermGroupAssociations {
  school: mappers.AssociatedRecordsIndex,
  course: mappers.AssociatedRecordsIndex,
}

export const termGroup = {
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
