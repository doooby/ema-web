import * as mp from '~/lib/api/mappers';
import { Country } from '~/lib/records';

export interface MaterialKit {
  id: string;
  // country: mp.AssociatedRecord<Country>;
  name: string[];
  code?: string;
  contents?: string;
}
