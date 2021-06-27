import { TableColumn, TableRow } from './types';
import View from './View.vue';

export function defineTableColumns (columns: TableColumn[]): Readonly<TableColumn[]> {
  // prevent name duplications
  const index: { [name: string]: TableColumn } = {};
  for (const column of columns) index[column.name] = Object.freeze(column);
  return Object.freeze(Object.values(index));
}

export {
  View,
  TableColumn,
  TableRow,
};
