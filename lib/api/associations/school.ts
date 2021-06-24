import * as mappers from '../mappers';

const { object, recordId, prop, val } = mappers;

export interface AssociatedSchool {
  id: number;
  name: string;
}

export function mapAssociatedSchool (value: any): AssociatedSchool {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
  }));
}
