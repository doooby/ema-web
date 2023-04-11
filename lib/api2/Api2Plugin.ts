import { Context } from '@nuxt/types';
import { RequestState as V1RequestState } from '~/lib/api';
import { RequestResponse, QueryDefinition, RequestState } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import {
  donor,
  education_level,
  group,
  material_kit,
  person,
  project,
  school,
  school_year,
  user,
  work_agreement,
} from '~/lib/records';

export default class Api2Plugin {
  context: Context;

  queries = {
    donors: donor.queries,
    education_levels: education_level.queries,
    groups: group.queries,
    material_kits: material_kit.queries,
    projects: project.queries,
    people: person.queries,
    schools: school.queries,
    school_years: school_year.queries,
    users: user.queries,
    work_agreements: work_agreement.queries,
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
      try {
        state.response = {
          ok: true,
          payload: query.reducer(response.payload),
        };
      } catch (error: any) {
        console.log('wut', error);
        if (error instanceof wai.MappingError) error.seal(response.payload);
        utils.warnOfError(error, { payload: response.payload });

        state.response = {
          ok: false,
          message: 'request_failed',
          error,
        };
      }
    } else {
      utils.warn('api2 request failed', response);
      state.response = response;
    }

    state.processing = false;
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
        this.context.store.commit('session/requestAuthnFailed');
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

  mapResponseToV1RequestState<V = never> (request: RequestState<V>): V1RequestState {
    const { processing, response } = request;
    if (processing || !response) {
      return {
        running: true,
        value: null,
        fail: null,
        error: null,
        reset () {},
      };
    }

    if (response.ok) {
      return {
        running: false,
        value: response.payload,
        fail: null,
        error: null,
        reset () {},
      };
    } else {
      return {
        running: false,
        value: null,
        fail: response.message,
        error: null,
        reset () {},
      };
    }
  }
}
