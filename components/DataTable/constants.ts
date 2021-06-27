import { TableColumn, TableRow } from './types';
import { PropType } from 'vue';

import AssociatedRecordCell from './c/AssociatedRecordCell.vue';

export const ACTIONS_COLUMN_WIDTH = 50;

export const TABLE_CELL_PROPS = {
  column: { type: Object as PropType<TableColumn>, required: true },
  row: { type: Object as PropType<TableRow>, required: true },
  template: { type: Function as PropType<any>, default: undefined },
};

export const CELL_COMPONENTS: { [name: string]: any } = {
  assoc: AssociatedRecordCell,
};
