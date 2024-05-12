import {
  BRecord,
  RecordAssociations,
  recordsQueries,
} from '~/lib/api2';
import {
  application_record,
} from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapName } from '~/lib/api2/mappers';

export const entity = 'schools';

export interface School extends application_record.SharedAttributes {
  country: BRecord;
  director?: BRecord;
  education_levels?: BRecord[];
  projects?: BRecord[];
  address?: string[];
  name?: string[];
  external_id?: string;
  education_types?: string[];
  gender_dedications?: string[];
  classrooms_count?: number;
  female_latrines_count?: number;
  male_latrines_count?: number;
}

export interface V3_School extends wai.AResource {
  record?: RecordSlice;
}

export interface RecordSlice {
  director?: wai.AResource;
  education_levels?: wai.AResource[];
  projects?: wai.AResource[];
  external_id?: string;
  name: string[];
  address?: string[];
  institution_types?: string[];
  education_types?: string[];
  gender_dedications?: string[];
  classrooms_count?: number;
  female_latrines_count?: number;
  male_latrines_count?: number;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): School {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    director: wai.prop('director_id', value, wai.nullable(mapAssociation('people', associations))),
    education_levels: wai.prop('education_levels_ids', value, mapAssociations('education_levels', associations)),
    projects: wai.prop('project_ids', value, mapAssociations('projects', associations)),
    address: wai.prop('address', value, wai.nullable(wai.listOfStrings)),
    name: wai.prop('name', value, wai.nullable(mapName)),
    external_id: wai.prop('external_id', value, wai.nullable(wai.string)),
    education_types: wai.prop('education_types', value, wai.nullable(wai.listOf(wai.string))),
    gender_dedications: wai.prop('gender_dedications', value, wai.nullable(wai.listOf(wai.string))),
    classrooms_count: wai.prop('classrooms_count', value, wai.nullable(wai.integer)),
    female_latrines_count: wai.prop('female_latrines_count', value, wai.nullable(wai.integer)),
    male_latrines_count: wai.prop('male_latrines_count', value, wai.nullable(wai.integer)),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function V3_parseRecord (
  value,
  associations: wai.Associations,
): V3_School {
  return wai.object(record => ({
    record: wai.property(record, 'record', wai.nullable(value => parseRecordSlice(value, associations))),
  }))(value);
}

function parseRecordSlice (
  value,
  wai_associations: wai.Associations,
): RecordSlice {
  const associations = wai_associations as any;
  return wai.object(value => ({
    director: wai.property(value, 'director_id', wai.nullable(mapAssociation('people', associations))),
    education_levels: wai.property(value, 'education_levels_ids', wai.nullable(mapAssociations('education_levels', associations))),
    projects: wai.property(value, 'projects_ids', wai.nullable(mapAssociations('projects', associations))),
    external_id: wai.property(value, 'external_id', wai.nullable(wai.string)),
    name: wai.property(value, 'name', wai.listOfStrings),
    address: wai.property(value, 'address', wai.nullable(wai.listOfStrings)),
    institution_types: wai.property(value, 'institution_types', wai.nullable(wai.listOfStrings)),
    education_types: wai.property(value, 'education_types', wai.nullable(wai.listOfStrings)),
    gender_dedications: wai.property(value, 'gender_dedications', wai.nullable(wai.listOfStrings)),
    classrooms_count: wai.property(value, 'classrooms_count', wai.nullable(wai.integer)),
    female_latrines_count: wai.property(value, 'female_latrines_count', wai.nullable(wai.integer)),
    male_latrines_count: wai.property(value, 'male_latrines_count', wai.nullable(wai.integer)),
  }))(value);
}
