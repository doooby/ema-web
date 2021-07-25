import Vue, { VNode } from 'vue';
import { cellComponents } from './cells';
import sharedProps from './cells/sharedProps';

export default Vue.extend({
  functional: true,
  props: sharedProps,
  render (createElement: any, { props }: any): VNode {
    const { column, dataItem, template } = props;
    if (template) return template({ column, dataItem });

    if (column.cell) {
      const component = cellComponents[column.cell.type];
      if (component) {
        return createElement(component, { column, dataItem, template });
      }
    }

    const { name, getText } = props.column;
    const textValue = getText ? getText(dataItem) : dataItem?.[name];
    return createElement('span', {}, sanitizeText(textValue));
  },
});

function sanitizeText (text: any): undefined | string {
  switch (typeof text) {
    case 'number': return String(text);
    case 'string': return text;
  }
}
