import { wai } from '~/vendor/wai';
import {
  BRecordsIndex,
  RecordAssociations,
  SearchRecordsResponsePayload,
  UpdatedRecordResponsePayload,
  BRecord,
  GenericUpdateResponsePayload, ErrorMessage,
} from '~/lib/api2/types';
import * as mappers from '~/lib/api2/mappers';

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
      const record_id = wai.prop('record_id', value, wai.nullable(wai.string));
      if (record_id?.length) {
        return { record_id };
      } else {
        return {
          errors: wai.prop('errors', value, errorMessages),
        };
      }
    },
  );
}

export function genericUpdatedResponsePayload (
): (value: unknown) => GenericUpdateResponsePayload {
  return wai.nullable(wai.object(
    (value) => {
      const errors = wai.prop('errors', value, wai.nullable(errorMessages));
      if (errors) {
        return { errors };
      }
    },
  ));
}

export function errorMessage (value: unknown): ErrorMessage {
  return wai.tuple(wai.nullable(wai.string), wai.string)(value);
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
      bRecordMapper(),
    ),
  );
}

export function bRecordMapper (): (value: unknown) => BRecord {
  return wai.object((value) => {
    // TODO this is inefficient
    const id = wai.prop('id', value, wai.string);
    const caption = wai.prop('caption', value, wai.nullable(wai.string)) ?? '';
    return {
      ...mappers.mapIndex(wai.nullable(wai.string))(value),
      id,
      caption,
    };
  });
}
