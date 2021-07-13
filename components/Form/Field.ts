import Vue, { VNode } from 'vue';
import { FormField } from './types';
import { FIELD_PROPS } from './constants';

import VoidControl from './controls/Void.vue';
import TextControl from './controls/Text.vue';
import AssociationControl from './controls/Association.vue';

const controlComponents: { [name: string]: any } = {
  assoc: AssociationControl,
  text: TextControl,
};

function getControl (field: FormField): null | Vue.Component {
  const control = field.control;
  let component = null as null | Vue.Component;
  if (typeof control === 'object') {
    component = controlComponents[control.type];
  } else {
    component = controlComponents[control];
  }
  return component;
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
