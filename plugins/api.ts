import { Context } from '@nuxt/types';
import { queries, QueryDefinition } from '~/lib/api';
import { safeMap } from '~/lib/api/mappers';
import { notify } from '~/lib/notifier';

interface RequestState <V = unknown> {
  running: boolean;
  fail: null | string;
  error: null | Error;
  value: null | V;
  reset(): void;
}

interface RequestOptions {
  headers?: { [header: string]: string };
  data?: any;
}

interface RequestResponse {
  ok: boolean;
  error?: Error;
  message?: string;
  payload?: any;
}

export class ApiPlugin {
  baseUrl: string;
  queries = queries;

  constructor (context: Context) {
    this.baseUrl = context.$config.apiBaseUrl;
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
      notify('error', 'api query definition not given');
      return null;
    }

    const { path, params, mapper } = definition;
    state.running = true;

    const response = await this.processRequest(path, { data: params });
    if (!response.ok) {
      state.error = response.error!;
      if (response.message) state.fail = response.message;
      notify('error', 'api query failed', response);
      state.running = false;
      return null;
    }

    const mappingResult = safeMap<V>(response.payload, mapper);
    if (mappingResult instanceof Error) {
      state.error = mappingResult;
      state.fail = 'invalid_data';
      notify('error', mappingResult, response.payload);
      state.running = false;
      return null;
    }

    state.value = mappingResult;
    state.running = false;
    return mappingResult;
  }

  async processRequest (path: string, options?: RequestOptions): Promise<RequestResponse> {
    const nativeOptions: any = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: options?.data && JSON.stringify(options.data),
    };

    try {
      const rawResponse = await globalThis.fetch(this.baseUrl + path, nativeOptions);
      const { ok, message, payload }: RequestResponse = await rawResponse.json();
      if (!ok) {
        return {
          ok,
          message: 'api.error.' + (message || 'undefined_error'),
        };
      }
      return { ok, payload, message };
    } catch (error) {
      return { ok: false, error };
    }
  }
}

export default (context: Context, inject: (key: string, value: any) => void) => {
  inject('api3', Object.freeze(new ApiPlugin(context)));
};

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiPlugin;
  }
}
