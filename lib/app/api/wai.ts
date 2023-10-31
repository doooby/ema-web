import { wai } from '~/vendor/wai';
import app from '~/lib/app';

export function recordsListing<R> (
  value,
  mapRecord: (record, associations: wai.Associations) => R,
): app.api.ResourcesListing<R> {
  return wai.object((payload) => {
    const associations = wai.property(payload, 'associations',
      wai.nullable(wai.indexOf(wai.indexOf(wai.aResource))),
    ) ?? {};
    const record = wai.uncertainResource(mapRecord);
    return {
      listing: wai.property(payload, 'listing', wai.object(
        value => ({
          page: wai.property(value, 'page', wai.integer),
          per_page: wai.property(value, 'per_page', wai.integer),
          order_by: wai.property(value, 'order_by', parseListingOrderBy),
        }),
      )),
      total: wai.property(payload, 'total', wai.integer),
      records: wai.property(payload, 'records',
        wai.listOf(item => record(item, associations)),
      ),
    };
  })(value);
}

function parseListingOrderBy (
  value,
): app.api.ListingParams['order_by'] {
  return wai.listOf(
    wai.tuple(
      wai.string,
      value => value === 'DESC' ? value : 'ASC',
    ),
  )(value);
}
