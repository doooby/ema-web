import app from '~/lib/app';
import { Api2Plugin, RequestResponse } from '~/lib/api2';

export function useResource<Record> (
  fn?: (params: app.db.QueryParams) => void,
): app.db.Resource<Record> {
  const queryParams = new app.db.QueryParams();
  fn?.(queryParams);
  return {
    isLoading: false,
    queryParams,
    response: undefined,
    cancel: undefined,
  };
}

export function useSaveableResource<Model = any> ({
  onSave,
  onSaveCanceled,
  $router,
}:{
  onSave?(): void;
  onSaveCanceled?(): void;
  $router: Vue['$router'],
}): app.db.SaveAbleResource<Model> {
  return {
    transaction: new app.Transaction(
      () => onSave?.(),
      () => onSaveCanceled ? onSaveCanceled() : $router.go(-1),
    ),
    model: {},
    errors: undefined,
    recordParams: undefined,
  };
}

export async function loadResource<Record> (
  context: { $api2: Api2Plugin },
  resource: app.db.Resource<Record>,
  block: (params: app.db.Params) => app.db.QueryDefinition<Record>,
) {
  resource.cancel?.();

  let canceled = false;
  resource.cancel = () => { canceled = true; };

  resource.isLoading = true;
  const params = resource.queryParams.produce();
  const definition = block(params);
  const response = await fetch(context, { params, ...definition });
  if (canceled) return;

  resource.response = response;
  resource.isLoading = false;
}

export function useFilters (...shown: string[]): {
  shown?: string[];
} {
  return {
    shown,
  };
}

// this is coupled with `Api2Plugin`
async function fetch<Data> (
  context: { $api2: Api2Plugin },
  query: app.db.QueryDefinition<Data>,
): Promise<RequestResponse<Data>> {
  const state = context.$api2.newQueryState<Data>();
  await context.$api2.request(state, {
    pathIsFull: true,
    path: `/v3${query.path}`,
    params: query.params,
    reducer: query.reducer ?? (a => a),
  });
  return state.response!; // yes, really
}

export function mapSortOptions (
  listingName: string,
  sortKeys: app.Maybe<string[]>,
): app.OptionItem<string>[] {
  return sortKeys?.map(value => ({
    value,
    item: `app.db.sort.${listingName}.${value}`,
  })) ?? [];
}
