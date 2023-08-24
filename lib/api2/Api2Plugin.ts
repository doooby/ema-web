import { Context } from '@nuxt/types';
import { RequestResponse, QueryDefinition, RequestState } from '~/lib/api2';
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

export default class Api2Plugin {
  context: Context;

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

  constructor (context: Context) {
    this.context = context;
  }

  newQueryState<V> (): RequestState<V> {
    return {
      processing: false,
      response: undefined,
    };
  }

  async request<V> (
    state: RequestState<V>,
    query: QueryDefinition<V>,
  ): Promise<void> {
    state.response = undefined;
    state.processing = true;

    let response;
    try {
      response = await this.processRequest(query.path, query.params);
    } catch (error) {
      response = {
        ok: false,
        message: 'request_fail',
        error,
      };
    }

    if (response.ok) {
      const [ error, payload ] = wai.tryParse(response.payload, query.reducer);
      if (error || !payload) {
        utils.warn('api2 request failed', query);
        utils.warnOfError(error, { payload: response.payload });

        state.response = {
          ok: false,
          message: 'request_failed',
          error: error ?? undefined,
        };
      } else {
        state.response = { ok: true, payload };
      }
    } else {
      utils.warn('api2 request failed', response);
      state.response = response;
    }

    state.processing = false;
  }

  async transientRequest<V> (query: QueryDefinition<V>): Promise<RequestResponse<V>> {
    const state = this.newQueryState<V>();
    await this.request(state, query);
    return state.response ?? { ok: false, message: 'api2.transientRequest.fatal' };
  }

  // TODO postData must be FormData to allow file uploading
  async processRequest (path: string, postData?: any): Promise<RequestResponse<never>> {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    const isOnServer = !!this.context.req;
    if (isOnServer) {
      headers.Cookie = this.context.req.headers.cookie;
    }

    const options: any = {
      method: 'POST',
      credentials: 'include',
      headers,
      body: (postData ? JSON.stringify(postData) : undefined),
    };

    const rawResponse = await globalThis.fetch(
      this.context.$config.api2BaseUrl + path,
      options,
    );
    const response = await rawResponse.json();
    if (!response.ok) {
      if (!isOnServer && rawResponse.status === 401) {
        this.context.store.commit('session/setUser', null);
      }
      response.message = response.message || 'unknown_error';
    }
    return response;
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
