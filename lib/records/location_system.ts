export interface LocationSystem {
  id: number;
  levels: LocationSystemLevel[];
}

interface LocationSystemLevel {
  type: 'list' | 'text';
  name: string;
  name_en?: string;
}

export interface Location {
  id: string;
  name: string;
  name_en?: string;
}
