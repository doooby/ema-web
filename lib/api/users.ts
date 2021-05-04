import { PaginatedRecords, parsers, Prop } from './parsers';
import { ApiRequest, Params, fetch } from '.';

export interface User {
  id: number;
  login: string;
  fullName: string;
}

export async function search (request: ApiRequest, params: Params)
  : Promise<null | PaginatedRecords<User>> {
  const response = await fetch('/users/search', {
    data: params,
  });
  if (request.canceled) return null;

  if (!response.ok) {
    request.lastFail = response.error;
    return null;
  }

  try {
    return parsers.paginatedRecords(response.payload, parseUser);
  } catch (_err) {
    request.lastFail = 'invalid_data';
    return null;
  }
}

function parseUser (object: Prop.Object): User {
  return {
    id: parsers.recordId(object),
    login: parsers.nonEmptyString(object, 'login'),
    fullName: parsers.nonEmptyString(object, 'full_name'),
  };
}
