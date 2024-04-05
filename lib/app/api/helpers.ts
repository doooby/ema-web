import { Api2Plugin, RequestResponse } from '~/lib/api2';
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

export async function createRecord (
  api: Api2Plugin,
  saveable: app.page.SaveableRecord,
  path: string,
  params?: app.api.Params,
): Promise<{
  success: boolean;
  recordId?: string;
}> {
  saveable.transaction.state.isProcessing = true;
  saveable.errors = undefined;
  const { response, okPayload } = await api.V3_request({
    path,
    params: { record: saveable.changeParams, ...params },
    reducer: wai.recordUpdate,
  });
  saveable.errors = app.api.createErrors(response);
  if (saveable.errors) {
    saveable.transaction.state.isProcessing = false;
    return { success: false };
  } else {
    return { success: true, recordId: okPayload?.record_id };
  }
}

export async function fetchRecord<R> (
  api: Api2Plugin,
  path: string,
  id: string,
  slices: app.Maybe<string[]>,
  parser: (value) => wai.AResource<R>,
): Promise<{
  success: true;
  record: wai.AResource<R>,
}
| {
  success: false;
  errorMessage: string;
}> {
  const { response } = await api.V3_request({
    path,
    params: {
      id,
      per_page: 1,
      slices,
    },
    reducer: value => wai.recordShow(value, parser),
  });

  let error;

  if (!response.ok) {
    error = response.reason;
  } else if (!response.payload?.record) {
    error = 'not_found';
  } else if (response.payload.record.error) {
    error = 'invalid_record';
  } else {
    return { success: true, record: response.payload.record };
  }

  return { success: false, errorMessage: `app.processing.${error}` };
}
