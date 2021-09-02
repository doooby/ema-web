import { Params } from '~/lib/api';

export function show () {
  return {
    path: '/session/show',
    mapper: (payload: any) => payload,
  };
}

export function login (params: Params) {
  return {
    path: '/session/login',
    params,
    mapper: (payload: any) => payload,
  };
}

export function logout () {
  return {
    path: '/session/logout',
    mapper: (_: any) => null,
  };
}
