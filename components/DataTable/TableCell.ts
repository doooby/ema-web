import Vue, { VNode } from 'vue';
import { TABLE_CELL_PROPS } from './constants';

import AssociatedRecordCell from './c/AssociatedRecordCell.vue';

export const cellComponents: { [name: string]: any } = {
  assoc: AssociatedRecordCell,
};

export default Vue.extend({
  functional: true,
  props: TABLE_CELL_PROPS,
  render (createElement, { props }): VNode {
    const { column, row, template } = props;
    if (template) return template({ row });

    if (column.cell) {
      const component = cellComponents[column.cell.type];
      if (component) return createElement(component, { props });
    }

    const { name, getText } = props.column;
    const textValue = getText ? getText(row.item) : row.item?.[name];
    return createElement('span', {}, renderTextCell(textValue));
  },
});

function renderTextCell (text: any): undefined | string {
  if (typeof text === 'number') return String(text);
  return typeof text === 'string' ? text : undefined;
}
