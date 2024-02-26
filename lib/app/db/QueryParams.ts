import app from '~/lib/app';

export default class QueryParams {
  staticParams: app.Maybe<app.db.Params> = undefined;
  listingParams: app.Maybe<app.db.ListingParams> = undefined;
  params: app.Maybe<app.db.Params> = undefined;

  produce (): app.db.Params {
    return {
      ...this.params,
      ...this.staticParams,
      ...this.listingParams,
    };
  }

  setParams (params) {
    this.params = params;
  }
}
