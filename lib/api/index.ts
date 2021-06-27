import { Context } from '@nuxt/types';
import 'vue';
import { safeMap } from '~/lib/api/mappers';

import * as countries from './countries';
import * as users from './users';

import * as courses from './courses';
import * as groups from './groups';
import * as schools from './schools';
import * as students from './students';

export interface ApiRequest {
  running: boolean;
  canceled: boolean;
  lastFail?: string;
  lastError?: Error;
}

export interface Params {
  [field: string]: any;
}

interface FetchOptions {
  headers?: { [header: string]: string };
  data?: any;
}

interface Response {
  ok: boolean;
  error?: string;
  payload?: any;
}

const API = {
  countries,
  users,

  courses,
  groups,
  schools,
  students,
};

export class ApiPlugin {
  context: Context;
  baseUrl: string;
  queries = API;

  constructor (context: Context) {
    this.context = context;
    this.baseUrl = 'http://localhost:3071/web';
  }

  static singleton: null | ApiPlugin = null;
  static createSingleton (context: Context): ApiPlugin {
    if (ApiPlugin.singleton !== null) throw new Error('consecutive instantiation');
    ApiPlugin.singleton = new ApiPlugin(context);
    return ApiPlugin.singleton;
  }

  createRequestState (): ApiRequest {
    return {
      running: false,
      canceled: false,
    };
  }

  async query <R, A extends Array<any> = any[]> (
    request: ApiRequest,
    query: (request: ApiRequest, ...args: A) => Promise<null | R>,
    ...args: A
  ): Promise<null | R> {
    this.context.app.store!.commit('api/addQuery', request);
    const result = await query(request, ...args);
    this.context.app.store!.commit('api/removeQuery', request);
    return result;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: ApiPlugin;
  }
}

export async function fetch (
  path: string,
  options?: FetchOptions,
): Promise<Response> {
  const plugin = ApiPlugin.singleton;
  if (!plugin) {
    return { ok: false, error: 'plugin_not_initialized' };
  }

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
    const rawResponse = await globalThis.fetch(plugin.baseUrl + path, nativeOptions);
    const response: Response = await rawResponse.json();
    if (!response.ok) {
      // const textKey = `apiService.${response.error || 'fatal_unknown'}`;
      // response.error = store.getState().localisation.t(textKey);
      response.error = 'api.error.' + (response.error || 'undefined_error');
    }
    return response;
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function processResponse <V> (
  request: ApiRequest,
  response: Response,
  processor: (payload: any) => V,
): null | V {
  if (request.canceled) return null;
  if (!response.ok) {
    request.lastFail = response.error;
    return null;
  }

  const mappingResult = safeMap(response.payload, processor);
  if (mappingResult instanceof Error) {
    request.lastError = mappingResult;
    request.lastFail = 'invalid_data';
    return null;
  }

  return mappingResult;
}

export async function query <V> (
  options: FetchOptions & {
    path: string,
    request: ApiRequest,
    mapper: (payload: any) => V,
  },
): Promise<null | V> {
  const response = await fetch(options.path, options);
  return processResponse(options.request, response, options.mapper);
}
