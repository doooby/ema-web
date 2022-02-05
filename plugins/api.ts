import { Context } from '@nuxt/types';
import { QueryDefinition, RequestResponse, RequestState } from '~/lib/api';
import queries from '~/lib/api/queries';
import { MappingError } from '~/lib/api/mappers';

export class ApiPlugin {
  queries = queries;
  context: Context;

  constructor (context: Context) {
    this.context = context;
  }

  newQueryState<V = any> (): RequestState<V> {
    const state = {
      running: false,
      fail: null,
      error: null,
      value: null,
      reset (): void {
        state.running = false;
        state.fail = null;
        state.error = null;
        state.value = null;
      },
    };
    return state;
  }

  async request<V = unknown> (
    definition: undefined | QueryDefinition<V>,
    state: RequestState<V>,
  ): Promise<null | V> {
    state.reset();

    if (!definition) {
      utils.warn('api query definition not given');
      return null;
    }

    const { path, params, mapper } = definition;
    state.running = true;

    const response = await this.processRequest(path, params);
    if (!response.ok) {
      state.error = response.error ?? null;
      if (response.message) state.fail = response.message;
      if (response.error) {
        utils.warnOfError(response.error, { path, params });
      } else {
        utils.warn('api query failed', { path, params }, response);
      }
      state.running = false;
      return null;
    }

    let mappingResult;
    try {
      mappingResult = mapper(response.payload);
    } catch (error) {
      if (error instanceof MappingError) error.finalize();
      else throw error;
      mappingResult = error;
    }
    if (mappingResult instanceof Error) {
      state.error = mappingResult;
      state.fail = 'invalid_data';
      utils.warnOfError(mappingResult, { path, params });
      mappingResult = null;
    }

    state.value = mappingResult;
    state.running = false;
    return mappingResult;
  }

  async processRequest (path: string, postData?: any): Promise<RequestResponse> {
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

    try {
      const rawResponse = await globalThis.fetch(
        this.context.$config.apiBaseUrl + path,
        options,
      );
      const { ok, message, payload }: RequestResponse = await rawResponse.json();
      if (!ok) {
        if (!isOnServer && rawResponse.status === 401) {
          this.context.store.commit('session/requestAuthnFailed');
        }

        return {
          ok,
          message: message || 'unknown_error',
        };
      }
      return { ok, payload, message };
    } catch (error) {
      return { ok: false, error };
    }
  }
}

export default (context: Context, inject: (key: string, value: any) => void) => {
  inject('api', Object.freeze(new ApiPlugin(context)));
};

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiPlugin;
  }
}
