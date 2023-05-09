import { wai } from '~/vendor/wai';
import { mapDate } from '~/lib/api2/mappers';
import { Column } from '~/components/DataTable/v3';
import { h } from 'vue';
import Translation from '~/components/toolkit/Translation.vue';

export interface SharedAttributes {
  id: string;
  created_at: Date;
  updated_at?: Date;
  archived_at?: Date;
}

export function parseSharedAttributes (value): SharedAttributes {
  return {
    id: wai.prop('id', value, wai.string),
    created_at: wai.prop('created_at', value, mapDate),
    updated_at: wai.prop('updated_at', value, wai.nullable(mapDate)),
    archived_at: wai.prop('archived_at', value, wai.nullable(mapDate)),
  };
}

export function fillDataTableColumns (entity: string, columnsExternal: (Partial<Column> | undefined)[]): Column[] {
  function renderHeader (column) {
    return h(Translation, {
      props: { value: `db.record.${entity}.label.${column.name}` },
      class: 'text-break',
    });
  }

  const columns = columnsExternal.filter(a => a) as (Partial<Column>)[];

  for (const column of columns) {
    if (!column.size) column.size = 180;
    if (!column.renderHeader) {
      column.renderHeader = renderHeader;
    }
  }
  return columns as Column[];
}
