import { Api2Plugin, BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { controls, FormFieldDefinition } from '~/components/Form';
import { application_record } from '~/lib/records/index';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapName } from '~/lib/api2/mappers';
import { dbFields } from '~/components/database/fields';
import app from '~/lib/app';

export const entity = 'schools';

export interface School extends application_record.SharedAttributes {
  country: BRecord;
  director?: BRecord;
  education_levels?: BRecord[];
  projects?: BRecord[];
  name?: string[];
  // address?: string[]; // TODO
  external_id?: string;
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

export function recordControls ({
  countryData,
  $api2,
}: {
  countryData?: app.session.CountryData;
  $api2: Api2Plugin;
}): FormFieldDefinition[] {
  return [
    [ 'director', dbFields.selectBRecord, { entity: 'people' } ],
    [ 'education_levels', dbFields.selectManyBRecords, { entity: 'education_levels' } ],
    // [ 'address', controls.location, {
    //   system: addressSystem,
    //   fetchLocations: async (parent_id?: number): Promise<MaybeData<Location[]>> => {
    //     if (!addressSystem) return { ok: false };
    //     const result = await api.request(
    //       api.queries.locations.index({
    //         location_system_id: addressSystem.id,
    //         parent: parent_id,
    //       }),
    //       api.newQueryState(),
    //     );
    //     if (!result) return { ok: false };
    //     const records = result.records.filter(record => !('__invalid' in record)) as Location[];
    //     return { ok: true, data: records };
    //   },
    // } ],
    [ 'name', controls.name ],
    [ 'external_id', controls.text ],
    [ 'education_types', controls.selectMultiple, {
      options: app.internalOptionsList(countryData, 'education_type'),
    } ],
    [ 'gender_dedications', controls.selectMultiple, {
      options: app.internalOptionsList(countryData, 'gender'),
    } ],
    [ 'classrooms_count', controls.integer ],
    [ 'female_latrines_count', controls.integer ],
    [ 'male_latrines_count', controls.integer ],
  ];
}
