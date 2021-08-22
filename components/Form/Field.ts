import Vue, { VNode } from 'vue';
import { FormField, FIELD_PROPS } from '.';
import VoidControl from './controls/Void.vue';
import { buildControlComponentsIndex } from '~/components/Form/controls';

let componentsIndex: any = null;
function getControl (field: FormField): null | Vue.Component {
  if (!componentsIndex) componentsIndex = buildControlComponentsIndex();
  const type = field[1];
  if (type === 'custom') return (field[2] as any)?.component || null;
  return componentsIndex[type] || null;
}

function getLabelText (field: FormField): string {
  const [ name, , opts ] = field;
  if (!opts?.label) return name;
  if (typeof opts.label === 'function') return opts.label();
  return String(opts.label);
}

export default Vue.extend({
  functional: true,
  props: FIELD_PROPS,
  render (createElement, { props, listeners }): VNode {
    const control = getControl(props.field);
    if (control === null) return createElement(VoidControl);
    return createElement(
      control,
      {
        props: { ...props, label: getLabelText(props.field) },
        on: {
          change (value: any) {
            (listeners.change as any)?.({ field: props.field, value });
          },
          commit () {
            (listeners.commit as any)?.();
          },
        },
      },
    );
  },
});
