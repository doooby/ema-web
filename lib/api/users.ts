/* eslint-disable camelcase */
import { ResourceChange, PaginatedRecords, mappers, Prop } from './mappers';
import { ApiRequest, Params, fetch, processResponse } from '.';

function parseUser (object: Prop.Object) {
  return {
    id: mappers.recordId(object),
    login: mappers.nonEmptyString(object.login),
    full_name: mappers.string(object.full_name),
  };
}

export type User = ReturnType<typeof parseUser>;

export async function search (request: ApiRequest, params: Params)
  : Promise<null | PaginatedRecords<User>> {
  const response = await fetch('/users/search', {
    data: params,
  });
  return processResponse(request, response,
    payload => mappers.paginatedRecords(payload, parseUser),
  );
}

export async function create (request: ApiRequest, user: Params)
  : Promise<null | ResourceChange> {
  const response = await fetch('/users/create', {
    data: { user },
  });
  console.log({ response });
  const parsed = processResponse(request, response,
    payload => mappers.changedRecord(payload),
  );
  console.log({ parsed });
  return parsed;
}
