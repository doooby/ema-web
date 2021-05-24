export interface TableRow {
  key: string;
  item: any;
  values: any[];
}

export interface TableColumn {
  key: string;
  caption: string;
}

export function defineTableColumns (...columns: TableColumn[]): Readonly<TableColumn[]> {
  // prevent name duplications
  const index: { [name: string]: TableColumn } = {};
  for (const column of columns) index[column.key] = Object.freeze(column);
  return Object.freeze(Object.values(index));
}
