// import FieldsGroupRow from '../FieldsGroupRow.vue';

import AssociationControl from './Association.vue';
import AssociatedRecordControl from './AssociatedRecord.vue';
import CalendarControl from './Calendar.vue';
import DateControl from './Date.vue';
import IntegerControl from './Integer.vue';
import TextControl from './Text.vue';
import TextMultilineControl from './TextMultiline.vue';
import ControlledTextControl from './ControlledText.vue';
import ListControl from './List.vue';
import SelectMultipleControl from './SelectMultiple.vue';

export const buildControlComponentsIndex: () => { [name: string]: any } = () => ({
  assoc: AssociationControl,
  associatedRecord: AssociatedRecordControl,
  calendar: CalendarControl,
  date: DateControl,
  integer: IntegerControl,
  text: TextControl,
  textMultiline: TextMultilineControl,
  controlledText: ControlledTextControl,
  list: ListControl,
  selectMultiple: SelectMultipleControl,

  // 'group-row': FieldsGroupRow,
});
