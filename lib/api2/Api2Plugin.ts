import { Context } from '@nuxt/types';
import {
  RequestResponse,
  QueryDefinition,
  RequestState,
  SearchRecordsResponsePayload,
  RecordLoader, Params, CachedRequestState,
} from '~/lib/api2';
import { wai } from '~/vendor/wai';
import {
  course,
  donor,
  education_level,
  group,
  location_system,
  material_kit,
  person,
  project,
  school,
  school_year,
  standardized_course,
  subject,
  subject_category,
  user,
  work_agreement,
} from '~/lib/records';
import { Vue } from 'vue-property-decorator';
import { api } from '~/lib/api2/module';

export default class Api2Plugin {
  queries = {
    [course.entity]: course.queries,
    [donor.entity]: donor.queries,
    [education_level.entity]: education_level.queries,
    [group.entity]: group.queries,
    [location_system.entity]: location_system.queries,
    [material_kit.entity]: material_kit.queries,
    [project.entity]: project.queries,
    [person.entity]: person.queries,
    [school.entity]: school.queries,
    [school_year.entity]: school_year.queries,
    [standardized_course.entity]: standardized_course.queries,
    [subject.entity]: subject.queries,
    [subject_category.entity]: subject_category.queries,
    [user.entity]: user.queries,
    [work_agreement.entity]: work_agreement.queries,
  };

  // eslint-disable-next-line no-useless-constructor
  constructor (readonly context: Context) {}

  newQueryState<V> (): RequestState<V> {
    return {
      processing: false,
      response: undefined,
    };
  }

  newCachedQueryState<V> (): CachedRequestState<V> {
    return {
      processing: false,
      response: undefined,
      currentPayload: undefined,
    };
  }

  resourceState<R> (
    query: api.Query<R>,
  ): api.QueryResourceState<R> {
    const state = Vue.observable<api.QueryResourceState<R>>({
      isLoading: false,
      resource: undefined,
      failReason: undefined,
      onReload: undefined,
    });

    const requestState = this.newQueryState<R>();

    state.onReload = async () => {
      if (state.isLoading) return;

      state.isLoading = true;
      await this.request(requestState, query);
      state.isLoading = false;
      const { response } = requestState;
      if (response) {
        state.resource = response?.ok ? response.payload : undefined;
        state.failReason = response?.ok === false ? response.reason : undefined;
      }
    };

    return state;
  }

  async request<V> (
    state: RequestState<V>,
    query_or_definition: api.Query<V> | QueryDefinition<V>,
  ): Promise<void> {
    const query: QueryDefinition<V> = query_or_definition instanceof api.Query
      ? query_or_definition.toDefinition()
      : query_or_definition;

    state.response = undefined;
    state.processing = true;

    let response;
    try {
      response = await this.processRequest(query as QueryDefinition);
    } catch (error) {
      response = {
        ok: false,
        error,
      };
    }

    if (response.ok) {
      const [ error, payload ] = wai.tryParse(response.payload, query.reducer);
      if (error || !payload) {
        utils.warnOfError(error, { query, payload: response.payload });

        state.response = {
          ok: false,
          reason: 'bad_response',
          message: 'request_bad_data',
          error: error ?? undefined,
        };
      } else {
        state.response = { ok: true, payload };
      }
    } else {
      if (!response.reason) response.reason = 'unknown';
      if (!response.message) response.message = 'request_fail';
      utils.warn('api2 request failed', response);
      state.response = response;
    }

    state.processing = false;
  }

  async transientRequest<V> (query: QueryDefinition<V>): Promise<RequestResponse<V>> {
    const state = this.newQueryState<V>();
    await this.request(state, query);
    return state.response!;
  }

  async transientRequest2<V> (
    query: api.Query<V>,
  ): Promise<RequestResponse<V>> {
    const state = this.newQueryState<V>();
    await this.request(state, query.toDefinition());
    return state.response!;
  }

  async cachedRequest<V> (
    state: CachedRequestState<V>,
    query: api.Query<V>,
  ): Promise<void> {
    await this.request(state, query.toDefinition());
    if (state.response?.ok) state.currentPayload = state.response.payload;
  }

  fetchRecord<R> (entity: string, params?: Params): Promise<RequestResponse<SearchRecordsResponsePayload<R>>> {
    return this.transientRequest(
      this.getQuery(entity, 'search')({
        ...params,
        per_page: 1,
      }),
    );
  }

  // TODO postData must be FormData to allow file uploading
  async processRequest (query: QueryDefinition): Promise<RequestResponse<never>> {
    const url = [
      this.context.$config.apiBaseUrl,
      query.pathIsFull ? '' : '/v2',
      query.path,
    ].join('');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const isOnServer = !!this.context.req;
    if (isOnServer) {
      headers.Cookie = this.context.req.headers.cookie ?? '';
    }

    query.params = {
      ...query.params,
      country_id: this.context.store.getters['session/countryId'],
    };

    const body = query.params ? JSON.stringify(query.params) : undefined;

    const rawResponse = await globalThis.fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers,
      body,
    });

    const response = await rawResponse.json();
    if (!response.ok) {
      if (!isOnServer && rawResponse.status === 401) {
        this.context.store.commit('session/clearUser');
      }
      response.message = response.message || 'unknown_error';
    }
    return response;
  }

  createLoader<V> (
    loader: () => Promise<RequestResponse<V>>,
  ) {
    const state = Vue.observable({
      loading: false,
      response: null as null | RequestResponse<V>,
      payload: null as null | V,
    });

    return Object.freeze({
      state,
      async load () {
        state.loading = true;
        state.response = null;
        state.payload = null;
        state.response = await loader();
        state.loading = false;
        if (state.response.ok && state.response.payload) {
          state.payload = state.response.payload;
        }
      },
    });
  }

  createRecordLoader<R> (
    loader: () => Promise<RequestResponse<SearchRecordsResponsePayload<R>>>,
  ): RecordLoader<R> {
    const state = Vue.observable({
      loading: false,
      response: null as null | RequestResponse<SearchRecordsResponsePayload<R>>,
      record: null as null | R,
    });

    return Object.freeze({
      state,
      async load () {
        state.loading = true;
        state.response = null;
        state.record = null;
        state.response = await loader();
        state.loading = false;
        if (state.response.ok && state.response.payload) {
          state.record = state.response.payload.records[0] ?? null;
        }
      },
    });
  }

  getQuery (entity: string, action: string): (...args: any[]) => QueryDefinition<any> {
    const query = (this.queries as any)[entity]?.[action];
    if (query) {
      return query;
    } else {
      return function () {
        const error = new Error(`$api2 query missing ${entity}.${action}`);
        utils.warnOfError(error);
        throw error;
      };
    }
  }

  mapPayload<V = never> (request: RequestState<V>) {
    return (request.response?.ok && request.response.payload) || undefined;
  }
}
