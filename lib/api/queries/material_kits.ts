import { material_kit } from '~/lib/records';
import { recordEndpoints } from '~/lib/api/queries/lib/records';

export const record = recordEndpoints<
  material_kit.MaterialKit,
  material_kit.Associations
  >({
    entity: 'material_kits',
    paramName: 'material_kit',
    mapRecord: material_kit.parse,
    mapAssociations: material_kit.parseAssociations,
  });
