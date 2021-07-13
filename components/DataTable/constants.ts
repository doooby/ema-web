import { TableColumn, TableRow } from './types';
import { PropType } from 'vue';

export const TABLE_CELL_PROPS = {
  column: { type: Object as PropType<TableColumn>, required: true },
  row: { type: Object as PropType<TableRow>, required: true },
  template: { type: Function as PropType<any>, default: undefined },
};
