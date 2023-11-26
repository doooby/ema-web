import app from '~/lib/app';
import { Vue } from 'vue-property-decorator';
import { api } from '~/lib/api2/module';
import { wai } from '~/vendor/wai';

export default class Resource<R> {
  static LISTING_PER_PAGE_OPTIONS = [ 10, 1, 25, 50, 100 ];

  state: app.api.ResourceState<R>;

  defaultParams: app.Maybe<app.api.Params> = undefined;
  listingParams: app.Maybe<app.api.ListingParams> = undefined;
  params: app.api.Params = {};

  _apiClient: app.Maybe<api.Api2Plugin>;

  constructor (
    readonly path: string,
    readonly reducer: (value) => R,
  ) {
    this.state = Vue.observable({
      isLoading: false,
      resource: undefined,
      failReason: undefined,
    });
  }

  static loadRecord<R> (context: Vue, options: {
    path: string;
    reducer: (value, associations: wai.Associations) => R;
    params?: app.api.Params,
  }): Resource<wai.ResourceShow<R>> {
    const resource = new Resource(
      options.path,
      value => wai.recordShow(value, options.reducer),
    );
    if (options.params) {
      resource.setDefaultParams(options.params);
      resource.updateParams();
    }
    resource.bindApiClient(context.$api2);
    resource.fetch();
    return resource;
  }

  bindApiClient (api: api.Api2Plugin) {
    this._apiClient = api;
  }

  setDefaultParams (params: app.api.Params) {
    this.defaultParams = params;
  }

  setListingParams (params: app.api.ListingParams) {
    this.listingParams = params;
  }

  resetListingParams ({
    keepPerPage = true,
    keepSort = true,
  }: {
    keepPerPage?: boolean,
    keepSort?: boolean,
  } = {}) {
    const page = 1;
    const per_page = (
      keepPerPage && this.listingParams?.per_page
    ) || Resource.LISTING_PER_PAGE_OPTIONS[0];
    const order_by = (
      keepSort && this.listingParams?.order_by
    ) || [ [ 'id', 'DESC' ] ];
    this.setListingParams({
      page,
      per_page,
      order_by,
    });
  }

  updateParams (params: app.api.Params = {}) {
    Object.assign(params, this.defaultParams);
    if (this.listingParams) {
      Object.assign(params, this.listingParams);
    }
    this.params = params;
  }

  async fetch () {
    if (!this._apiClient || this.state.isLoading) return;

    this.state.isLoading = true;
    const state = this._apiClient.newQueryState<R>();
    await this._apiClient.request(
      state,
      {
        pathIsFull: true,
        path: this.path,
        reducer: this.reducer,
        params: this.params,
      },
    );
    this.state.isLoading = false;

    const { response } = state;
    if (response) {
      this.state.resource = response?.ok
        ? response.payload
        : undefined;
      this.state.failReason = response?.ok === false
        ? response.reason
        : undefined;
    }
  }
}
