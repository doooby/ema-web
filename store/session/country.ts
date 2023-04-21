import * as mappers from '~/lib/api/mappers';
import { location_system } from '~/lib/records';
import app from '~/lib/app';

export interface CountryData {
  country: mappers.AssociatedRecord;
  addressSystem?: location_system.LocationSystem;
  staticData: app.country.Data;
}
