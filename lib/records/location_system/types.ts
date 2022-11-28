import { Location } from '~/lib/records';

export interface LocationSystem {
  id: number;
  name: [string, string];
  levels: number;
  settings?: Record<string, undefined | LocationSystemLevel>;
}

export interface LocationSystemLevel {
  type: 's' | 't';
  name: [string, string];
}

export type LocationItem =
  | {
  type: 's';
  location: Location;
}
| {
  type: 't';
  text?: string;
};
