import { wai } from '~/vendor/wai';

export type AResource<S = {}> = S & {
  id?: string;
  caption?: string;
  archived_at?: string;
  error?: wai.MappingError;
};

export type Associations = Record<string, undefined | Record<string, undefined | AResource>>;

// TODO deprecated, use `RecordsList`
export interface ResourcesListing<R = {}> {
  total: number;
  records: AResource<R>[];
}

export type ResourceShow<R = {}> = { record: undefined | AResource<R> };

export interface RecordsList<R = {}> {
  listing: {
    page: number;
    per_page: number;
    order_by: undefined | [ string, string ][];
  }
  total: number;
  records: AResource<R>[];
}

export interface ResourceUpdate {
  record_id?: string;
  errors?: ResourceError[];
}

export type ResourceError = [ undefined | string, string ];

export function aResource (value): AResource {
  return wai.object2(value, basicResource);
}

function basicResource (value: wai.Object): AResource {
  return {
    id: wai.property(value, 'id', wai.nullable(wai.string)),
    caption: wai.property(value, 'caption', wai.nullable(wai.string)),
    archived_at: wai.property(value, 'archived_at', wai.nullable(wai.string)),
  };
}

function specificResource<S> (
  value: wai.Object,
  mapRecord: (record) => S,
): AResource<S> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, caption, archived_at, ...record } = value;
  return {
    ...basicResource(value),
    ...(mapRecord(record)),
  };
}

export function uncertainResource<S> (
  mapRecord: (record, associations: Associations) => S,
): (value, associations: Associations) => AResource<S> {
  return (value, associations) => {
    try {
      return wai.object2(value,
        value => specificResource(value, record => mapRecord(record, associations)),
      );
    } catch (error) {
      if (!(error instanceof wai.MappingError)) {
        throw error;
      }

      error.seal(value);
      if (typeof value !== 'object') value = {};
      utils.warnOfError(error, { value });

      return {
        id: String(value.id),
        caption: String(value.caption),
        error,
      } as AResource<never>;
    }
  };
}

function resourceError (value): ResourceError {
  return wai.tuple(wai.nullable(wai.string), wai.string)(value);
}

export function resourceErrors (value): ResourceError[] {
  return wai.listOf(resourceError)(value);
}

export function associatedRecord (
  associations: Associations,
  name: string,
  value_id,
): AResource {
  const item = associations[name]?.[value_id];

  if (!item) {
    throw new wai.MappingError(`association ${name}.${value_id} is missing`);
  }

  return item;
}

export function recordShow<R> (
  value,
  mapRecord: (record, associations: Associations) => R,
): ResourceShow<R> {
  return wai.object((listing) => {
    const associations = wai.property(listing, 'associations',
      wai.nullable(wai.indexOf(wai.indexOf(aResource))),
    ) ?? {};
    const [ record ] = wai.property(listing, 'records', wai.tuple(
      wai.nullable(value => uncertainResource(mapRecord)(value, associations)),
      () => undefined,
    ));
    return { record };
  })(value);
}

export function recordsList<R = {}> (
  value,
  mapRecord?: (record, associations: Associations) => R,
): RecordsList<R> {
  return wai.object((value) => {
    const associations = wai.property(value, 'associations',
      wai.indexOf(wai.indexOf(aResource)),
    );
    const record = uncertainResource(mapRecord ?? (() => undefined));

    return {
      listing: wai.property(value, 'listing', wai.object(value => ({
        page: wai.property(value, 'page', wai.integer),
        per_page: wai.property(value, 'per_page', wai.integer),
        order_by: wai.property(value, 'order_by',
          wai.nullable(wai.listOf(
            wai.tuple(wai.string, wai.string),
          )),
        ),
      }))),
      total: wai.property(value, 'total', wai.integer),
      records: wai.property(value, 'records',
        wai.listOf(item => record(item, associations)),
      ),
    };
  })(value);
}

export function recordUpdate (value): ResourceUpdate {
  return wai.object(value => ({
    record_id: wai.property(value, 'record_id', wai.nullable(wai.string)),
    errors: wai.property(value, 'errors', wai.nullable(resourceErrors)),
  }))(value);
}
