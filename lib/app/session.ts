import { location_system, user } from '~/lib/records';
import app from '~/lib/app/index';
import { Api2Plugin, BRecord, SearchRecordsResponsePayload } from '~/lib/api2';
import { staticLists } from '~/lib/app/country/internalLists';
import { wai } from '~/vendor/wai';
import { Store } from 'vuex';
import { api } from '~/lib/api2/module';

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
  return Object.freeze({
    record: country,
    addressSystem,
    internalLists: staticLists,
  });
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

export async function fetchUser ({
  api2,
  store,
}: {
  api2: Api2Plugin,
  store: Store<any>,
}) {
  const auth = await api2.transientRequest2(queries.authn());

  if (!auth.ok) {
    store.commit('session/clearUser');
    return;
  }

  if (auth.payload.id !== store.state.session.user?.id) {
    store.commit('session/setCountry', null);

    const session = await api2.transientRequest2(queries.show());
    if (
      !session.ok ||
      session.payload.record.error ||
      !session.payload.record.session
    ) {
      store.commit('session/clearUser');
      return;
    }

    const user = session.payload.record.session;
    store.commit('session/setUser', user);
  }
}

export const queries = {

  authn () {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/users/session/authn',
      reducer: value => wai.object(value => ({
        id: wai.property(value, 'id', wai.string),
      }))(value),
    });
  },

  show () {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/users/session/show',
      reducer: data => wai.object(value => ({
        record: wai.property(value, 'record', value => user.V3_parseRecord(value, {})),
      }))(data),
    });
  },

};
