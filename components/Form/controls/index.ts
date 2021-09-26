import { FormFieldType } from '..';

import AssociatedRecordControl, { type as AssociatedRecordControlType } from './AssociatedRecord.vue';
import CalendarControl, { type as CalendarControlType } from './Calendar.vue';
import ControlledTextControl, { type as ControlledTextControlType } from './ControlledText.vue';
import DateControl, { type as DateControlType } from './Date.vue';
import IntegerControl, { type as IntegerControlType } from './Integer.vue';
import ListControl, { type as ListControlType } from './List.vue';
import TextControl, { type as TextControlType } from './Text.vue';
import TextMultilineControl, { type as TextMultilineControlType } from './TextMultiline.vue';

import VoidControl, { type as VoidControlType } from './Void.vue';

const controlsIndex = {} as { [name: string]: undefined | FormFieldType };
export const voidFieldType: FormFieldType = {
  ...VoidControlType,
  control: VoidControl,
};

export function getControlType (type: string | FormFieldType): FormFieldType {
  const typeOfType = typeof type;
  if (typeOfType === 'object') return type as FormFieldType;
  if (typeOfType === 'string') {
    const knownType = controlsIndex[type as string];
    if (knownType) return knownType;
  }

  utils.warn('Form controls - unknown type', type);
  return voidFieldType;
}

function add (type: any, control: any) {
  controlsIndex[type.name] = {
    ...type,
    control,
  };
}

add(AssociatedRecordControlType, AssociatedRecordControl);
add(CalendarControlType, CalendarControl);
add(ControlledTextControlType, ControlledTextControl);
add(DateControlType, DateControl);
add(IntegerControlType, IntegerControl);
add(ListControlType, ListControl);
add(TextControlType, TextControl);
add(TextMultilineControlType, TextMultilineControl);
