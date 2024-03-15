import { Params } from '~/lib/api2/types';
import app from '~/lib/app';
import controls from '~/components/controls';

export interface FieldDefinition {
  name: string;
  default?: null | boolean | number | string | (() => unknown);
  onChange?:(values: GroupValues) => void;
  populateParams?:(values: GroupValues, params: Params) => void;
  options?: app.OptionItem[];
  custom?: any;
}

export interface GroupState {
  values: GroupValues;
  params: Params;
  fields: app.Maybe<app.Map<controls.FieldDefinition>>;
}

export type GroupValues = Record<string, unknown>;
