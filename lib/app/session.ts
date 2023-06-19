import { location_system } from '~/lib/records';
import app from '~/lib/app/index';
import { BRecord, Api2Plugin, SearchRecordsResponsePayload } from '~/lib/api2';
import { staticLists } from '~/lib/app/country/internalLists';

export interface User {
  id: number;
  login: string;
  name: string[];
  countries: BRecord[];
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
