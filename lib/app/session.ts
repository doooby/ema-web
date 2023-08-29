import { location_system } from '~/lib/records';
import app from '~/lib/app/index';
import { Api2Plugin, BRecord, SearchRecordsResponsePayload } from '~/lib/api2';
import { staticLists } from '~/lib/app/country/internalLists';
import { wai } from '~/vendor/wai';
import { mapIndex, mapName } from '~/lib/api2/mappers';
import { bRecordMapper } from '~/lib/api2/parsers';

export interface User {
  id: string;
  login: string;
  name: string[];
  countries: BRecord[];
  admissible_actions?: Record<string, string[]>;
}

export interface CountryData {
  record: BRecord;
  addressSystem?: location_system.LocationSystem;
  internalLists?: Record<string, undefined | app.InternalOptionsList>;
}

export async function loadCountryData (
  country: BRecord,
  $api2: Api2Plugin,
): Promise<CountryData> {
  const addressSystem = await fetchAddressSystem(country, $api2);
  return {
    record: country,
    addressSystem,
    internalLists: staticLists,
  };
}

async function fetchAddressSystem (
  country: BRecord,
  $api2: Api2Plugin,
): Promise<undefined | location_system.LocationSystem> {
  const state = $api2.newQueryState<
    SearchRecordsResponsePayload<location_system.LocationSystem>
  >();
  await $api2.request(
    state,
    $api2.getQuery('location_systems', 'search')({
      country_id: country.id,
      label: 'address',
      per_page: 1,
    }),
  );
  return state.response?.ok
    ? state.response.payload.records[0]
    : undefined;
}

export const queries = {
  getSession () {
    return {
      path: '/session',
      reducer: data => wai.object(value => ({
        user: wai.prop('user', value, wai.object(value => ({
          id: wai.prop('id', value, wai.string),
          login: wai.prop('login', value, wai.string),
          name: wai.prop('name', value, mapName),
          countries: wai.prop('countries', value, wai.listOf(bRecordMapper())),
          admissible_actions: wai.prop(
            'admissible_actions',
            value,
            wai.nullable(mapIndex(wai.listOf(wai.string))),
          ),
        }))),
      }))(data),
    };
  },
};
