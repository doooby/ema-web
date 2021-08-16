import 'vue';

import * as countries from './countries';
import * as users from './users';

import * as courses from './courses';
import * as education_levels from './education_levels';
import * as groups from './groups';
import * as schools from './schools';
import * as students from './students';

export interface ApiRequest {
  running: boolean;
  canceled: boolean;
  lastFail?: string;
  lastError?: Error;
}

export interface Params {
  [field: string]: any;
}

export interface QueryDefinition<V = unknown> {
  path: string;
  params?: Params;
  mapper: (payload: any) => V;
}

export const queries = {
  countries,
  users,

  courses,
  education_levels,
  groups,
  schools,
  students,
};

// export async function query <V> (
//   options: FetchOptions & {
//     path: string,
//     request: ApiRequest,
//     mapper: (payload: any) => V,
//   },
// ): Promise<null | V> {
//   const response = await fetch(options.path, options);
//   return processResponse(options.request, response, options.mapper);
// }
