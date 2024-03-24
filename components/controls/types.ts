import { Params } from '~/lib/api2/types';
import app from '~/lib/app';
import controls from '~/components/controls';

export interface FieldDefinition {
  name: string;
  default?: unknown | (() => unknown);
  onChange?:(values: app.Map<unknown>) => void;
  populateParams?:(values: app.Map<unknown>, params: Params) => void;
  options?: app.OptionItem[];
  custom?: any;
}

export interface GroupState {
  values: app.Map<unknown>;
  params: Params;
  fields: app.Maybe<app.Map<controls.FieldDefinition>>;
}
