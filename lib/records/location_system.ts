export interface LocationSystem {
  id: number;
  levels: LocationSystemLevel[];
}

export interface LocationSystemLevel {
  type: 'list' | 'text';
  name: string;
  name_en?: string;
}

export interface Location {
  id: string;
  name: string;
  name_en?: string;
}
