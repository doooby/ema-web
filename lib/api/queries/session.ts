import { Params } from '~/lib/api';
import { mapSessionUser, SessionUser } from '~/lib/records';
import * as mappers from '~/lib/api/mappers';

interface Session {
  user: SessionUser;
  pageAllowed?: boolean;
}

function mapSession (value: any): Session {
  return mappers.object(value, root => ({
    user: mappers.prop('user', root, mapSessionUser),
    pageAllowed: mappers.maybeProp('page_allowed', root, mappers.val.boolean),
  }));
}

export function show () {
  return {
    path: '/session/show',
    mapper: mapSession,
  };
}

export function login (params: Params) {
  return {
    path: '/session/login',
    params,
    mapper: (_: any) => true,
  };
}

export function logout () {
  return {
    path: '/session/logout',
    mapper: (_: any) => true,
  };
}
