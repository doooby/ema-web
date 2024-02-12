import { RequestResponse } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';

// deprecated
export function updateSuccess (
  response?: RequestResponse<wai.ResourceUpdate>,
): boolean {
  if (!response?.ok) return false;
  return !response.payload.errors?.length;
}

export function showErrors (
  response?: RequestResponse<wai.ResourceShow>,
  checkSlices?: string[],
): app.Maybe<wai.ResourceError[]> {
  if (!response) return;

  if (!response.ok) {
    return [ [ undefined, response.reason ] ];
  } else if (!response.payload) {
    return [ [ undefined, 'not_found' ] ];
  }

  if (!checkSlices?.length) return;
  for (const sliceName of checkSlices) {
    if (!(sliceName in response.payload)) {
      return [ [ undefined, 'not_found' ] ];
    }
  }
}

export function createErrors (
  response?: RequestResponse<wai.ResourceUpdate>,
): app.Maybe<wai.ResourceError[]> {
  if (!response) return;

  if (!response.ok) {
    return [ [ undefined, response.reason ] ];
  } else if (response.payload.errors?.length) {
    return response.payload.errors;
  } else if (!response.payload.record_id) {
    return [ [ undefined, 'not_created' ] ];
  }
}

export function updateErrors (
  response?: RequestResponse<wai.ResourceUpdate>,
): app.Maybe<wai.ResourceError[]> {
  if (!response) return;

  if (!response.ok) {
    return [ [ undefined, response.reason ] ];
  } else if (response.payload.errors?.length) {
    return response.payload.errors;
  }
}
