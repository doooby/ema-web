import { wai } from '~/vendor/wai';
import { RecordAssociations, BRecord } from '~/lib/api2';
import { parseISO as parseDate } from 'date-fns';

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

export function mapAssociation (
  name: string,
  associations: undefined | RecordAssociations,
): (value: unknown) => BRecord {
  const index = associations?.[name];

  return (value: unknown) => {
    if (!associations || !index) {
      throw new wai.MappingError('association missing');
    }

    const bRecord = index[String(value)];
    if (!bRecord) {
      throw new wai.MappingError('association missing');
    }
    return bRecord;
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
