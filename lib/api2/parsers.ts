import { wai } from 'wai';
import {
  BRecordsIndex,
  ErrorMessage,
  SearchRecordsResponsePayload,
  UpdatedRecordResponsePayload,
} from '~/lib/api2';

export function searchResponsePayload<R> (
  parseRecord: (value: unknown) => R,
): (value: unknown) => SearchRecordsResponsePayload<R> {
  return wai.object(
    value => ({
      page: wai.prop('page', value, wai.integer),
      pages_count: wai.prop('pages_count', value, wai.integer),
      total: wai.prop('total', value, wai.integer),
      per_page: wai.prop('per_page', value, wai.integer),
      records: wai.prop('records', value, parseListOfRecords(parseRecord)),
      associations: wai.prop(
        'associations', value, wai.nullable(parseRecordsAssociations),
      ),
    }),
  );
}

export function updatedRecordResponsePayload (
): (value: unknown) => UpdatedRecordResponsePayload {
  return wai.object(
    (value) => {
      const success = wai.prop('success', value, wai.boolean);
      if (success) {
        return {
          success: true,
          record_id: wai.prop('record_id', value, wai.string),
        };
      } else {
        return {
          success: false,
          record_id: wai.prop('record_id', value, wai.nullable(wai.string)),
          errors: wai.prop('errors', value, errorMessages),
        };
      }
    },
  );
}

export function errorMessage (value: unknown): ErrorMessage {
  return wai.object(value => ({
    label: wai.prop('label', value, wai.string),
    message: wai.prop('message', value, wai.string),
  }))(value);
}

export function errorMessages (value: unknown): ErrorMessage[] {
  return wai.nullable(wai.listOf(errorMessage))(value) ?? [];
}

function parseListOfRecords<R> (
  parseRecord: (value: unknown) => R,
): (value: unknown) => R[] {
  return wai.listOf(parseRecord);
}

function mapIndex<I> (
  item: (value: unknown) => I,
): (value: unknown) => Record<string, I> {
  return wai.object((value) => {
    for (const key of Object.keys(value)) {
      value[key] = item(value[key]);
    }
    return value;
  });
}

function parseRecordsAssociations (
  value: unknown,
): Record<string, undefined | BRecordsIndex> {
  return mapIndex(
    mapIndex(
      wai.object((value) => {
        const id = wai.prop('id', value, wai.string);
        return {
          ...mapIndex(wai.string),
          id,
        };
      }),
    ),
  )(value);
}
