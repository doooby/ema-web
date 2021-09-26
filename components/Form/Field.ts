import Vue, { PropType, VNode } from 'vue';
import { FormField, FormGroupContext, FormValues } from '.';
import VoidControl from './controls/Void.vue';
import { getControlType } from '~/components/Form/controls';

function getControl (field: FormField): null | Vue.Component {
  const type = field[1];
  if (type === 'custom') return (field[2] as any)?.control || null;
  return getControlType(field)?.control || null;
}

export default Vue.extend({
  functional: true,
  props: {
    name: { type: String, required: true },
    context: { type: Object as PropType<FormGroupContext>, required: true },
    values: { type: Object as PropType<FormValues>, required: true },
  },
  render (createElement, { props }): VNode {
    const { name, context, values } = props;
    const field = context.field(name);
    const control = field && getControl(field);
    if (control === null) return createElement(VoidControl);
    return createElement(
      control,
      { props: { field, context, formValues: values } },
    );
  },
});
