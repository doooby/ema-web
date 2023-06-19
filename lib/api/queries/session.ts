import { Params } from '~/lib/api';
import * as mappers from '~/lib/api/mappers';
import app from '~/lib/app';

interface Session {
  user: app.session.User;
}

function mapSession (value: any): Session {
  return mappers.object(value, root => ({
    user: mappers.prop('user', root, value => value),
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
