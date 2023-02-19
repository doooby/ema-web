import { Context } from '@nuxt/types';
import { RequestResponse, QueryDefinition, RequestState } from '~/lib/api2';
import { wai } from 'wai';

export default class Api2Plugin {
  context: Context;

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
    stateRef: RequestState<V>,
    query: QueryDefinition<V>,
  ): Promise<void> {
    stateRef.response = undefined;
    stateRef.processing = true;

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
        stateRef.response = {
          ok: true,
          payload: query.reducer(response.payload),
        };
      } catch (error: any) {
        if (error instanceof wai.MappingError) error.seal(response.payload);
        stateRef.response = {
          ok: false,
          message: 'bad_payload',
          error,
        };
      }
    } else {
      utils.warn('api2 request failed', response);
      stateRef.response = response;
    }

    stateRef.processing = false;
  }

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
}
