import { recordQueries } from '~/lib/api2';
import { material_kit } from '~/lib/records';

const { search, create, update } = recordQueries(
  'material_kits',
  'material_kit',
  material_kit.parsers.record,
);

export { search, create, update };
