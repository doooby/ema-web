import { location_system, user } from '~/lib/records';
import app from '~/lib/app/index';
import { Api2Plugin, BRecord } from '~/lib/api2';
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
  addressSystem?: location_system.V3_LocationSystem;
  internalLists: Record<string, undefined | app.InternalOptionsList>;
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

  if (auth.payload.country !== store.state.session.country?.record.id) {
    store.commit('session/clearCountry');
  }

  if (
    auth.payload.id !== store.state.session.user?.id ||
    !store.state.session.country?.record.id
  ) {
    const session = await api2.transientRequest2(queries.show());
    if (
      !session.ok ||
      session.payload.record.error ||
      !session.payload.record.session ||
      !session.payload.record.current_country
    ) {
      store.commit('session/clearUser');
      return;
    }

    store.commit('session/setUser', {
      session: session.payload.record.session,
      current_country: session.payload.record.current_country,
    });
  }
}

export const queries = {

  login (params) {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/users/session/login',
      params,
      reducer: () => true,
    });
  },

  logout () {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/users/session/logout',
      reducer: () => true,
    });
  },

  authn () {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/users/session/authn',
      reducer: value => wai.object(value => ({
        id: wai.property(value, 'id', wai.string),
        country: wai.property(value, 'country', wai.string),
      }))(value),
    });
  },

  show () {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/users/session/show',
      reducer: data => wai.object(value => ({
        record: wai.property(value, 'record',
          value => user.V3_parseRecord(value, {}),
        ),
      }))(data),
    });
  },

  set_current_country (county_id: string) {
    return new api.Query({
      pathIsFull: true,
      path: '/v3/users/session/set_current_country',
      params: { country: county_id },
      reducer: () => true,
    });
  },

};
