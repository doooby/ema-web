export interface Params {
  [field: string]: any;
}

export interface QueryDefinition<D = never> {
  path: string;
  params?: Params;
  reducer: (payload: unknown) => D;
}

export interface RequestState<V> {
  processing: boolean;
  response: undefined | RequestResponse<V>;
}

export type RequestResponse<V> =
  | {
  ok: false;
  message: string;
  error?: Error;
}
  | {
  ok: true;
  payload: V;
}

export interface ErrorMessage {
  label: string;
  message: string;
}

export interface SearchRecordsResponsePayload<R = never> {
  page: number;
  pages_count: number;
  total: number;
  per_page: number;
  records: R[];
}

export type UpdatedRecordResponsePayload =
  | { success: false; record_id?: string; errors: ErrorMessage[] }
  | { success: true; record_id: string }

export interface BRecord {
  id: string;
  [label: string]: undefined | string;
}

export type BRecordsIndex = Record<string, undefined | BRecord>;

export type RecordAssociations = Record<string, undefined | BRecordsIndex>;