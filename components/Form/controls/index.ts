import { FormField } from '..';

import AssociatedRecordControl, { meta as AssociatedRecordControlMeta } from './AssociatedRecord.vue';
import CalendarControl, { meta as CalendarControlMeta } from './Calendar.vue';
import ControlledTextControl, { meta as ControlledTextControlMeta } from './ControlledText.vue';
import DateControl, { meta as DateControlMeta } from './Date.vue';
import IntegerControl, { meta as IntegerControlMeta } from './Integer.vue';
import ListControl, { meta as ListControlMeta } from './List.vue';
import TextControl, { meta as TextControlMeta } from './Text.vue';
import TextMultilineControl, { meta as TextMultilineControlMeta } from './TextMultiline.vue';

const ControlsIndex = {} as { [name: string]: any };

export function getControlType (field: FormField): undefined | any {
  return ControlsIndex[field[1]];
}

function add (meta: any, control: any) {
  ControlsIndex[meta.name] = {
    control,
    meta,
  };
}

add(AssociatedRecordControlMeta, AssociatedRecordControl);
add(CalendarControlMeta, CalendarControl);
add(ControlledTextControlMeta, ControlledTextControl);
add(DateControlMeta, DateControl);
add(IntegerControlMeta, IntegerControl);
add(ListControlMeta, ListControl);
add(TextControlMeta, TextControl);
add(TextMultilineControlMeta, TextMultilineControl);
