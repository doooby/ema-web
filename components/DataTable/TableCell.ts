import Vue, { VNode } from 'vue';
import { TABLE_CELL_PROPS, CELL_COMPONENTS } from './constants';

export default Vue.extend({
  functional: true,
  props: TABLE_CELL_PROPS,
  render (createElement, { props }): VNode {
    const { column, row, template } = props;
    if (template) return template({ row });

    // if (column.cell) {
    //   const component = CELL_COMPONENTS[column.cell.type];
    //   if (component) return createElement(component, { props });
    // }

    const { name, getText } = props.column;
    const textValue = getText ? getText(row.item) : row.item?.[name];
    return createElement('span', {}, renderTextCell(textValue));
  },
});

function renderTextCell (text: any): undefined | string {
  if (typeof text === 'number') return String(text);
  return typeof text === 'string' ? text : undefined;
}
