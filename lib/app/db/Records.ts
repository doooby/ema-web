import app from '~/lib/app';
import { Api2Plugin, RequestResponse } from '~/lib/api2';
import { wai } from '~/vendor/wai';

export default class Records<T> {
  isLoading = false;

  queryParams: app.db.QueryParams;

  response: app.Maybe<RequestResponse<wai.RecordsList<T>>>;

  cancel: app.Maybe<() => void> = undefined;

  constructor (options: {
    params?: {
      staticParams?: app.db.Params,
      listingParams?: app.db.ListingParams,
      params?: app.db.Params,
    },
  }) {
    this.queryParams = new app.db.QueryParams(options.params ?? {});
  }

  get failReason () {
    if (!this.response || this.response.ok) return;
    return this.response.reason;
  }

  get okPayload () {
    return this.response?.ok ? this.response.payload : undefined;
  }

  get params () {
    return this.queryParams.params;
  }

  setParams (params: app.db.Params) {
    this.queryParams.params = params;
  }

  refresh () {
    if (!this.queryParams.listingParams) return;
    this.queryParams.listingParams = {
      ...this.queryParams.listingParams,
      page: 1,
    };
  }

  async load (
    $api2: Api2Plugin,
    path: string,
    reducer: (value) => wai.AResource<T>,
  ) {
    let canceled = false;
    this.cancel?.();
    this.cancel = () => { canceled = true; };
    this.isLoading = true;
    const response = await app.db.fetch({ $api2 }, {
      path,
      params: this.queryParams.produce(),
      reducer: value => wai.recordsList(value, reducer),
    });
    if (canceled) return;
    this.response = response;
    this.isLoading = false;
  }
}
