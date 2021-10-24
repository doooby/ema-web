import { Params } from '~/lib/api';
import { mapUserDetail, UserDetail } from '~/lib/records';
import * as mappers from '~/lib/api/mappers';

interface Session {
  user: UserDetail;
  pageAllowed?: boolean;
}

function mapSession (value: any): Session {
  return mappers.object(value, root => ({
    user: mappers.prop('user', root, mapUserDetail),
    pageAllowed: mappers.maybeProp('page_allowed', root, mappers.val.boolean),
  }));
}

export function show (requestedAllowance?: { entity: string, action: string }) {
  let admission: any;
  if (requestedAllowance) {
    const { entity, action } = requestedAllowance;
    admission = [ entity, action ];
  }

  return {
    path: '/session/show',
    params: {
      admission,
    },
    mapper: mapSession,
  };
}

export function login (params: Params) {
  return {
    path: '/session/login',
    params,
    mapper: mapUserDetail,
  };
}

export function logout () {
  return {
    path: '/session/logout',
    mapper: (_: any) => null,
  };
}
