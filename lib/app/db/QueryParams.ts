import app from '~/lib/app';

export default class QueryParams {
  params: app.Maybe<app.db.Params> = undefined;
  staticParams: app.Maybe<app.db.Params> = undefined;
  listingParams: app.Maybe<app.api.ListingParams> = undefined;

  produce (): app.db.Params {
    return {
      ...this.params,
      ...this.staticParams,
      ...this.listingParams,
    };
  }
}
