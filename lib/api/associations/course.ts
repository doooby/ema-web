import * as mappers from '../mappers';

const { object, recordId, prop, val } = mappers;

export interface AssociatedCourse {
  id: number;
  name: string;
}

export function mapAssociatedCourse (value: any): AssociatedCourse {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
  }));
}
