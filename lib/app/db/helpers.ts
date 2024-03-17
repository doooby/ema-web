import app from '~/lib/app';
import { Api2Plugin, RequestResponse } from '~/lib/api2';

// this is coupled with `Api2Plugin`
export async function fetch<Data> (
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
