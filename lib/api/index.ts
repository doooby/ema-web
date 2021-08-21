import 'vue';

export interface ApiRequest {
  running: boolean;
  canceled: boolean;
  lastFail?: string;
  lastError?: Error;
}

export interface Params {
  [field: string]: any;
}

export interface QueryDefinition<V = unknown> {
  path: string;
  params?: Params;
  mapper: (payload: any) => V;
}

export interface RequestState <V = unknown> {
  running: boolean;
  fail: null | string;
  error: null | Error;
  value: null | V;
  reset(): void;
}

export interface RequestOptions {
  headers?: { [header: string]: string };
  data?: any;
}

export interface RequestResponse {
  ok: boolean;
  error?: Error;
  message?: string;
  payload?: any;
}

// export async function query <V> (
//   options: FetchOptions & {
//     path: string,
//     request: ApiRequest,
//     mapper: (payload: any) => V,
//   },
// ): Promise<null | V> {
//   const response = await fetch(options.path, options);
//   return processResponse(options.request, response, options.mapper);
// }
