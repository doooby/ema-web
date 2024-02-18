import app from '~/lib/app';
import { wai } from '~/vendor/wai';

export type Params = app.Map<unknown>;

// TODO deprecated, use `app.db.Resource`
export interface ResourceState<R = unknown> {
  isLoading: boolean;
  resource: app.Maybe<R>;
  failReason: app.Maybe<string>;
}

export interface ListingParams {
  page: number;
  per_page: number;
  order_by: [ string, 'ASC' | 'DESC' ][];
}

// TODO use wai instead
export interface RecordsListing<R> extends wai.ResourcesListing<R> {
  listing: ListingParams;
}
