import BooleanControl from './Boolean.vue';
import CalendarControl, { type as CalendarControlType } from './Calendar.vue';
import DateControl, { type as DateControlType } from './Date.vue';
import IntegerControl, { type as IntegerControlType } from './Integer.vue';
import ListControl, { type as ListControlType } from './List.vue';
import TextControl, { type as TextControlType } from './Text.vue';
import TextMultilineControl, { type as TextMultilineControlType } from './TextMultiline.vue';

import VoidControl, { type as VoidControlType } from './Void.vue';

export const controlsIndex = {} as any;

export const voidFieldType = {
  ...VoidControlType,
  control: VoidControl,
};

function add (type: any, control: any) {
  if (!type.name) throw new Error(`missing type.name: ${type.name}`);
  if (controlsIndex[type.name]) throw new Error(`duplicate type.name: ${type.name}`);
  controlsIndex[type.name] = {
    ...type,
    control,
  };
}

add(BooleanControl.fieldType, BooleanControl);
add(CalendarControlType, CalendarControl);
add(DateControlType, DateControl);
add(IntegerControlType, IntegerControl);
add(ListControlType, ListControl);
add(TextControlType, TextControl);
add(TextMultilineControlType, TextMultilineControl);
