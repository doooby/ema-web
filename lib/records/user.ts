import * as mappers from '~/lib/api/mappers';

export interface User {
  id: number;
  login: string;
  full_name_en?: string;
  full_name?: string;
  country: mappers.AssociatedRecord;
}

export interface UserAssociations {
  country: mappers.AssociatedRecordsIndex,
}
