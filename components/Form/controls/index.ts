import { FormField } from '..';

// import AssociationControl from './Association.vue';
// import AssociatedRecordControl from './AssociatedRecord.vue';
// import CalendarControl from './Calendar.vue';
// import DateControl from './Date.vue';
// import IntegerControl from './Integer.vue';
import TextControl, { meta as TextControlMeta } from './Text.vue';
// import TextMultilineControl from './TextMultiline.vue';
// import ControlledTextControl from './ControlledText.vue';
// import ListControl from './List.vue';
// import SelectMultipleControl from './SelectMultiple.vue';

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

add(TextControlMeta, TextControl);

// export const buildControlComponentsIndex: () => { [name: string]: any } = () => ({
//   assoc: AssociationControl,
//   associatedRecord: AssociatedRecordControl,
//   calendar: CalendarControl,
//   date: DateControl,
//   integer: IntegerControl,
//   textMultiline: TextMultilineControl,
//   controlledText: ControlledTextControl,
//   list: ListControl,
//   selectMultiple: SelectMultipleControl,
//
//   // 'group-row': FieldsGroupRow,
// });
