import app from '~/lib/app';
import { RequestResponse } from '~/lib/api2';

export type Params = app.Map<unknown>;

export type ErrorMessage = [ undefined | string, string ];

export interface QueryDefinition<Payload = never> {
  path: string;
  params?: Params;
  reducer?: (payload) => Payload;
}

export interface Resource<Record> {
  isLoading: boolean;
  queryParams: app.db.QueryParams;
  response: app.Maybe<RequestResponse<Record>>;
  refreshAtPage1: () => void;
  cancel: app.Maybe<() => void>;
  okPayload: app.Maybe<Record>;
}

export interface SaveAbleResource<Model = any> {
  transaction: app.Transaction;
  model: app.Map<Model>;
  errors: app.Maybe<ErrorMessage[]>;
  recordParams: app.Maybe<() => Params>
}

export interface ListingParams {
  page: number;
  per_page: number;
  order_by: [ string, 'ASC' | 'DESC' ][];
}
