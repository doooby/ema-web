import app from '~/lib/app';

export interface Params {
  [field: string]: any;
}

export interface QueryDefinition<D = never> {
  path: string;
  params?: Params;
  reducer: (payload: unknown) => D;
  pathIsFull?: boolean;
}

export interface RequestState<V> {
  processing: boolean;
  response: undefined | RequestResponse<V>;
}

export interface CachedRequestState<V> extends RequestState<V> {
  currentPayload: undefined | V;
}

export type RequestResponse<V> =
  | {
  ok: false;
  reason: string;
  payload?: unknown;
  // TODO v2 remove
  message: string;
  error?: Error;
}
  | {
  ok: true;
  payload: V;
}

export type ErrorMessage = [ undefined | string, string ];

export interface SearchRecordsResponsePayload<R = never> {
  page: number;
  pages_count: number;
  total: number;
  per_page: number;
  records: R[];
  sort_keys: app.Maybe<string[]>;
}

export type UpdatedRecordResponsePayload =
  | { record_id: undefined; errors: ErrorMessage[] }
  | { record_id: string }

export type GenericUpdateResponsePayload =
  | undefined
  | { errors: ErrorMessage[] }

export interface BRecord {
  id: string;
  caption: string;
  [label: string]: undefined | string;
}

export type BRecordsIndex = Record<string, undefined | BRecord>;

export type RecordAssociations = Record<string, undefined | BRecordsIndex>;

export interface Loader<V> {
  state: {
    loading: boolean;
    response: null | RequestResponse<V>;
    payload: null | V;
  },
  load(): Promise<void>;
}

export interface RecordLoader<R> {
  state: {
    loading: boolean;
    response: null | RequestResponse<SearchRecordsResponsePayload<R>>
    record: null | R;
  },
  load(): Promise<void>;
}
