import { Params } from '~/lib/api';
import * as mappers from '~/lib/api/mappers';
import { schoolYear } from '~/lib/records/school_year';

export function index (params: Params) {
  return {
    path: '/school_years',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, schoolYear.mapRecord, schoolYear.mapAssociations),
  };
}

export function create (schoolYear: Params) {
  return {
    path: '/school_years/create',
    params: { school_year: schoolYear },
    mapper: mappers.changedRecord,
  };
}

export function show (schoolYearId: number) {
  return {
    path: `/school_years/${schoolYearId}`,
    mapper: (payload: any) => mappers.record(payload, schoolYear.mapRecord, schoolYear.mapAssociations),
  };
}

export function update (schoolYearId: number, schoolYear: Params) {
  return {
    path: `/school_years/${schoolYearId}/update`,
    params: { school_year: schoolYear },
    mapper: mappers.changedRecord,
  };
}
