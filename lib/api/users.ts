import * as mappers from './mappers';
import { ApiRequest, Params, fetch, processResponse } from '.';

const { object, recordId, prop, val } = mappers;

interface User {
  id: string;
  login: string;
  fullName: string;
}

function parseUser (value: any): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    fullName: prop('full_name', root, val.string),
  }));
}

export async function search (request: ApiRequest, params: Params)
  : Promise<null | mappers.PaginatedRecords<User>> {
  const response = await fetch('/users/search', {
    data: params,
  });
  return processResponse(request, response,
    payload => mappers.paginatedRecords(payload, parseUser),
  );
}

export async function create (request: ApiRequest, user: Params)
  : Promise<null | mappers.RecordChange> {
  const response = await fetch('/users/create', {
    data: { user },
  });
  return processResponse(request, response,
    payload => mappers.changedRecord(payload),
  );
}
