import Vue from 'vue';
import View from './View.vue';

export const ACTIONS_COLUMN_WIDTH = 50;

export type Cell = undefined | string | Vue.VNode;

export interface TableRow {
  name: string;
  item: any;
  cells: Cell[];
}

export interface TableColumn {
  name: string;
  caption?: string;
}

export function defineTableColumns (columns: TableColumn[]): Readonly<TableColumn[]> {
  // prevent name duplications
  const index: { [name: string]: TableColumn } = {};
  for (const column of columns) index[column.name] = Object.freeze(column);
  return Object.freeze(Object.values(index));
}

export {
  View,
};
