import * as mappers from './mappers';
import { ApiRequest, Params, fetch, processResponse } from '.';

const { object, recordId, prop, val } = mappers;

interface Country {
  id: number;
  designation: string;
}

function mapCountry (value: any): Country {
  return object(value, root => ({
    id: recordId(root),
    designation: prop('designation', root, val.string),
  }));
}

export async function search (request: ApiRequest, params: Params)
  : Promise<null | mappers.PaginatedRecords<Country>> {
  const response = await fetch('/countries/search', {
    data: params,
  });
  return processResponse(request, response,
    payload => mappers.paginatedRecords(payload, mapCountry),
  );
}

export async function get (request: ApiRequest, countryId: number)
  : Promise<null | mappers.RecordGet<Country>> {
  const response = await fetch(`/countries/${countryId}`);
  return processResponse(request, response,
    payload => mappers.record(payload, mapCountry),
  );
}

export async function create (request: ApiRequest, country: Params)
  : Promise<null | mappers.RecordChange> {
  const response = await fetch('/countries/create', {
    data: { country },
  });
  return processResponse(request, response, mappers.changedRecord);
}

export async function update (request: ApiRequest, countryId: number, country: Params)
  : Promise<null | mappers.RecordChange> {
  const response = await fetch(`/countries/${countryId}/update`, {
    data: { country },
  });
  return processResponse(request, response, mappers.changedRecord);
}
