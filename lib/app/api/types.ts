import app from '~/lib/app';
import { wai } from '~/vendor/wai';

export type Params = app.Map<unknown>;

export interface ResourceState<R = unknown> {
  isLoading: boolean;
  resource?: R;
  failReason?: string;
}

export interface ListingParams {
  page: number;
  per_page: number;
  order_by: [ string, 'ASC' | 'DESC' ][];
}

export interface ResourcesListing<R> extends wai.ResourcesListing<R> {
  listing: ListingParams;
}
