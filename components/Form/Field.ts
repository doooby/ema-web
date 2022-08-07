import Vue from 'vue';
import { FormGroupContext, FormValues } from '.';
import VoidControl from './controls/Void.vue';

export default Vue.extend({
  functional: true,
  props: {
    name: { type: String, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    values: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  render (createElement, { props }): Vue.VNode {
    const { name, context, values } = props;
    const field = context.field(name);
    if (!field) {
      return createElement(VoidControl);
    }

    if (field.options?.hideIf) {
      if (field.options.hideIf(values)) return createElement('div');
    }

    return createElement(
      field.type.control,
      { props: { field, context, formValues: values } },
    );
  },
});
