import { wai } from '~/vendor/wai';
import { RecordAssociations, BRecord } from '~/lib/api2';
import { parseISO as parseDate } from 'date-fns';
import { maybeProp, prop, tuple } from '~/lib/api/mappers';

// TODO move to wai ?

// TODO produces wrong error messages
export function mapIndex<I> (
  item: (value: unknown) => I,
): (value: unknown) => Record<string, I> {
  return wai.object((value) => {
    for (const key of Object.keys(value)) {
      value[key] = item(value[key]);
    }
    return value;
  });
}

export function mapDate (value): Date {
  if (typeof value !== 'string') {
    throw new wai.MappingError('not date');
  }
  const date = parseDate(value);
  if (!date || isNaN(date as any)) {
    throw new wai.MappingError('not date');
  }
  return date;
}

export function mapName (value): string[] {
  return wai.listOf(value => wai.nullable(wai.string)(value) ?? '')(value);
}

export function mapSelectOrFillTuple (value: any): [string, undefined | string] {
  if (!Array.isArray(value)) return [ '', undefined ];
  return wai.tuple(
    wai.string,
    wai.nullable(wai.string),
  )(value);
}

export function mapAssociation (
  name: string,
  associations: undefined | RecordAssociations,
): (value: unknown) => BRecord {
  const index = associations?.[name];

  return (value: unknown) => {
    if (!index) throw new wai.MappingError('association missing');

    const id = wai.string(value);
    const bRecord = index[id];
    if (!bRecord) throw new wai.MappingError('association missing');
    return bRecord;
  };
}

export function mapAssociations (
  name: string,
  associations: undefined | RecordAssociations,
):(value: unknown) => undefined | BRecord[] {
  const index = associations?.[name];

  return (value: unknown) => {
    if (!index) throw new wai.MappingError('association missing');

    const ids = wai.nullable(wai.listOf(wai.string))(value);
    if (!ids) return undefined;

    return ids.map((id, i) => {
      const bRecord = index[id];
      if (!bRecord) {
        const error = new wai.MappingError('association missing');
        error.addPropertyTrace(i, value);
        throw error;
      }
      return bRecord;
    });
  };
}

export function mapOptionalAssociation (
  name: string,
  associations: undefined | RecordAssociations,
): (value: unknown) => undefined | BRecord {
  const index = associations?.[name];
  if (!associations || !index) {
    return () => undefined;
  }

  return (value: unknown) => {
    return index[String(value)];
  };
}
