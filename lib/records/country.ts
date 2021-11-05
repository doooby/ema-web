import * as mappers from '~/lib/api/mappers';

const { object, recordId, prop, maybeProp, list, val } = mappers;

export interface Country {
  id: number;
  name: string;
  local_names: string[];
}

export function mapCountry (value: any): Country {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    local_names: maybeProp('local_names', root, names => list(names, val.string)) || [],
  }));
}
