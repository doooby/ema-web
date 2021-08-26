import * as mappers from '~/lib/api/mappers';

export interface School {
  id: number;
  name_en: string;
  name?: string;
  address?: string;
  country: mappers.AssociatedRecord;
}

export interface SchoolAssociations {
  country: mappers.AssociatedRecordsIndex,
}
