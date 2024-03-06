import app from '~/lib/app';

export interface QueryParamsOptions {
  staticParams?: app.db.Params,
  listingParams?: app.db.ListingParams,
  params?: app.db.Params,
}

export default class QueryParams {
  staticParams: app.Maybe<app.db.Params> = undefined;
  listingParams: app.Maybe<app.db.ListingParams> = undefined;
  params: app.Maybe<app.db.Params> = undefined;

  constructor ({
    staticParams,
    listingParams,
    params,
  }: {
    staticParams?: app.db.Params,
    listingParams?: app.db.ListingParams,
    params?: app.db.Params,
  }) {
    if (staticParams) this.staticParams = staticParams;
    if (listingParams) this.listingParams = listingParams;
    if (params) this.params = params;
  }

  produce (): app.db.Params {
    return {
      ...this.params,
      ...this.staticParams,
      ...this.listingParams,
    };
  }
}
