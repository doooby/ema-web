import Vue, { VNode } from 'vue';
import { FormField, FormField2 } from './types';
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

function getControl (field: FormField | FormField2): null | Vue.Component {
  if (Array.isArray(field)) {
    return controlComponents[field[1]] || null;
  }

  const control = field.control;
  let component;
  if (typeof control === 'object') {
    if (control.type === 'custom' && control.component) return control.component;
    component = controlComponents[control.type];
  } else {
    component = controlComponents[control];
  }
  return component;
}

export default Vue.extend({
  functional: true,
  props: FIELD_PROPS,
  render (createElement, { props, listeners, parent }): VNode {
    const control = getControl(props.field);
    if (control === null) return createElement(VoidControl);
    return createElement(
      control,
      {
        props: { ...props, label: getLabelText(props.field, parent) },
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

function getLabelText (field: FormField | FormField2, parent: any): string {
  if (Array.isArray(field)) {
    const [ name, , opts ] = field;
    if (!opts?.label) return name;
    if (typeof opts.label === 'function') return opts.label();
    return String(opts.label);
  } else {
    return parent.$t(fieldCaptionGet(field)) as string;
  }
}

function fieldCaptionGet (field: FormField): string {
  return field.caption || `form.field.${field.name}`;
}
