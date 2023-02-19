import { wai } from 'wai';
import {
  BRecordsIndex,
  ErrorMessage, RecordAssociations,
  SearchRecordsResponsePayload,
  UpdatedRecordResponsePayload,
  mappers,
} from '~/lib/api2';

export function searchResponsePayload<R> (
  parseRecord: (value: unknown, associations?: RecordAssociations) => R,
): (value: unknown) => SearchRecordsResponsePayload<R> {
  return wai.object(
    (value) => {
      const associations = wai.prop(
        'associations', value, wai.nullable(parseRecordsAssociations()),
      );
      return {
        page: wai.prop('page', value, wai.integer),
        pages_count: wai.prop('pages_count', value, wai.integer),
        total: wai.prop('total', value, wai.integer),
        per_page: wai.prop('per_page', value, wai.integer),
        records: wai.prop('records', value, parseListOfRecords(
          value => parseRecord(value, associations),
        )),
      };
    },
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

function parseRecordsAssociations (
): (value: unknown) => Record<string, undefined | BRecordsIndex> {
  return mappers.mapIndex(
    mappers.mapIndex(
      wai.object((value) => {
        const id = wai.prop('id', value, wai.string);
        return {
          ...mappers.mapIndex(wai.string),
          id,
        };
      }),
    ),
  );
}