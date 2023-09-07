import { Params } from '~/lib/api2/types';

export interface FieldDefinition {
  name: string;
  default?: null | boolean | number | (() => unknown);
  populateParams?:(values: GroupValues, params: Params) => void;
}

export interface GroupState {
  values: GroupValues;
  params: Params;
}

export type GroupValues = Record<string, unknown>;
