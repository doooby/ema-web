import { RequestResponse } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';

export function updateSuccess (
  response?: RequestResponse<wai.ResourceUpdate>,
): boolean {
  if (!response?.ok) return false;
  return !response.payload.errors?.length;
}

export function createErrors (
  response?: RequestResponse<wai.ResourceUpdate>,
): app.Maybe<wai.ResourceError[]> {
  if (response) {
    if (!response.ok) {
      return [ [ undefined, response.reason ] ];
    } else if (response.payload.errors?.length) {
      return response.payload.errors;
    } else if (!response.payload.record_id) {
      return [ [ undefined, 'not_created' ] ];
    }
  }
}

export function updateErrors (
  response?: RequestResponse<wai.ResourceUpdate>,
): app.Maybe<wai.ResourceError[]> {
  if (response) {
    if (!response.ok) {
      return [ [ undefined, response.reason ] ];
    } else if (response.payload.errors?.length) {
      return response.payload.errors;
    }
  }
}
