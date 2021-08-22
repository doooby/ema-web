import Vue, { VNode } from 'vue';
import { FormField2 } from './types';
import { FIELD_PROPS } from './constants';

import VoidControl from './controls/Void.vue';
import AssociationControl from './controls/Association.vue';
import CalendarControl from './controls/Calendar.vue';
import DateControl from './controls/Date.vue';
import IntegerControl from './controls/Integer.vue';
import TextControl from './controls/Text.vue';
import ListControl from './controls/List.vue';

const controlComponents: { [name: string]: any } = {
  assoc: AssociationControl,
  calendar: CalendarControl,
  date: DateControl,
  integer: IntegerControl,
  text: TextControl,
  list: ListControl,
};

function getControl (field: FormField2): null | Vue.Component {
  const type = field[1];
  if (type === 'custom') return (field[2] as any)?.component || null;
  return controlComponents[type] || null;
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

function getLabelText (field: FormField2): string {
  const [ name, , opts ] = field;
  if (!opts?.label) return name;
  if (typeof opts.label === 'function') return opts.label();
  return String(opts.label);
}
