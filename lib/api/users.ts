import * as mappers from './mappers';
import { ApiRequest, Params, fetch, processResponse } from '.';

const { object, recordId, prop, maybeProp, val } = mappers;

interface User {
  id: number;
  login: string;
  full_name?: string;
}

function mapUser (value: any): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    full_name: maybeProp('full_name', root, val.string),
  }));
}

export async function search (request: ApiRequest, params: Params)
  : Promise<null | mappers.PaginatedRecords<User>> {
  const response = await fetch('/users/search', {
    data: params,
  });
  return processResponse(request, response,
    payload => mappers.paginatedRecords(payload, mapUser),
  );
}

export async function get (request: ApiRequest, userId: number)
  : Promise<null | mappers.RecordGet<User>> {
  const response = await fetch(`/users/${userId}`);
  return processResponse(request, response,
    payload => mappers.record(payload, mapUser),
  );
}

export async function create (request: ApiRequest, user: Params)
  : Promise<null | mappers.RecordChange> {
  const response = await fetch('/users/create', {
    data: { user },
  });
  return processResponse(request, response, mappers.changedRecord);
}

export async function update (request: ApiRequest, userId: number, user: Params)
  : Promise<null | mappers.RecordChange> {
  const response = await fetch(`/users/${userId}/update`, {
    data: { user },
  });
  return processResponse(request, response, mappers.changedRecord);
}
