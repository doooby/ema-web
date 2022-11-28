import * as mappers from '~/lib/api/mappers';
import { location_system } from '~/lib/records';

export interface CountryData {
  country: mappers.AssociatedRecord;
  addressSystem?: location_system.LocationSystem;
}
