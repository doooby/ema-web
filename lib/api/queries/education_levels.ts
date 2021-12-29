import { Params } from '..';
import * as mappers from '../mappers';
import { EducationLevel } from '~/lib/records';

const { object, recordId, prop, maybeProp, val } = mappers;

function mapEducationLevel (value: any): EducationLevel {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    level: prop('level', root, val.integer),
    terms_per_year: maybeProp('terms_per_year', root, val.integer),
    years_length: maybeProp('years_length', root, val.integer),
    start_age: maybeProp('start_age', root, val.integer),
    mandatory: maybeProp('mandatory', root, val.boolean),
  }));
}

export function index (params: Params) {
  return {
    path: '/education_levels',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapEducationLevel),
  };
}
