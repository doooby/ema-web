import Vue, { VNode } from 'vue';
import { FormField } from '.';
import { FIELD_PROPS } from './constants';

import VoidControl from './controls/Void.vue';
import TextControl from './controls/Text.vue';

function getControl (field: FormField): null | Vue.Component {
  switch (field.controlType) {
    case 'text': return TextControl;
    default: return null;
  }
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
        props,
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
