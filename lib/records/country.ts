import * as mappers from '~/lib/api/mappers';
import { CountryData } from '~/store/session/country';

const { object, recordId, prop, val } = mappers;

export interface Country {
  id: number;
  name_en: string;
  name: string;
}

export function mapCountry (value: any): Country {
  return object(value, root => ({
    id: recordId(root),
    name_en: prop('name_en', root, val.string),
    name: prop('name', root, val.string),
  }));
}

export async function loadCountryData (
  country: mappers.AssociatedRecord,
  api: any,
): Promise<CountryData> {
  const addressSystemResult = await api.request(
    api.queries.location_systems.getAddressSystem({
      country_id: country.id,
    }),
    api.newQueryState(),
  );
  let addressSystem = addressSystemResult?.records?.[0];
  if (!(addressSystem && !('__invalid' in addressSystem))) {
    addressSystem = undefined;
  }

  return {
    country,
    addressSystem,
  };
}
