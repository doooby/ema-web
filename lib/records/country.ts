import * as mappers from '~/lib/api/mappers';

const { object, recordId, prop, maybeProp, val } = mappers;

export interface Country {
  id: number;
  name_en: string;
  name?: string;
}

export function mapCountry (value: any): Country {
  return object(value, root => ({
    id: recordId(root),
    name_en: prop('name_en', root, val.string),
    name: maybeProp('name', root, val.string),
  }));
}
