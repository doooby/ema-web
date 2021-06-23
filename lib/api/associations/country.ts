import * as mappers from '../mappers';

const { object, recordId, prop, val } = mappers;

export interface AssociatedCountry {
  id: number;
  name: string;
}

export function mapAssociatedCountry (value: any): AssociatedCountry {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
  }));
}
