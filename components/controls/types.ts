import { Params } from '~/lib/api2/types';
import app from '~/lib/app';

export interface FieldDefinition {
  name: string;
  default?: null | boolean | number | string | (() => unknown);
  onChange?:(values: GroupValues) => void;
  populateParams?:(values: GroupValues, params: Params) => void;
  options?: app.OptionItem[];
}

export interface GroupState {
  values: GroupValues;
  params: Params;
}

export type GroupValues = Record<string, unknown>;
