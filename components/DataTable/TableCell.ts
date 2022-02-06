import Vue, { PropType, VNode } from 'vue';
import { DataTable } from '~/components/DataTable/index';

export default Vue.extend({
  functional: true,
  props: {
    column: { type: Object as PropType<DataTable.Column>, required: true },
    dataItem: { type: Object as PropType<any>, required: true },
    template: { type: Function as PropType<any>, default: undefined },
  },
  render (createElement: any, { props }: any): VNode {
    const { column, dataItem, template } = props;
    if (template) return template({ column, dataItem });

    if (column.cell) {
      const component = column.cell.type;
      if (component) {
        return createElement(
          component,
          {
            props: { column, dataItem, template },
          },
        );
      }
    }

    const { name, getText } = props.column;
    const textValue = getText ? safeGetText(getText, dataItem) : dataItem?.[name];
    return createElement(
      'div',
      {
        attrs: {
          class: 'single-row-cell',
        },
      },
      sanitizeText(textValue),
    );
  },
});

function safeGetText (getText: any, dataItem: any): any {
  try {
    return getText?.(dataItem);
  } catch (err) {
    utils.warnOfError(err, { 'DataTable.TableCell': 'getText failed' });
    return null;
  }
}

function sanitizeText (text: any): undefined | string {
  switch (typeof text) {
    case 'number': return String(text);
    case 'string': return text;
  }
}
