import { BRecord } from '~/lib/api2';
import * as mappers from '~/lib/api/mappers';
import { application_record } from '~/lib/records';

export interface User extends application_record.SharedAttributes {
  country?: BRecord;
  login: string;
  full_name: string[];
  lock?: string;
  privileges: UserPrivilege[];
  is_root: boolean;
}

export interface UserPrivilege {
  type: null | 'country_admin' | 'collector' | 'data_officer';
  [ opt: string ]: any;
}

export interface SessionUser {
  id: number;
  login: string;
  name: [string, string];
  countries: mappers.AssociatedRecord[];
}
