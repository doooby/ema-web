// import FieldsGroupRow from '../FieldsGroupRow.vue';

import AssociationControl from './Association.vue';
import CalendarControl from './Calendar.vue';
import DateControl from './Date.vue';
import IntegerControl from './Integer.vue';
import TextControl from './Text.vue';
import ListControl from './List.vue';

export const buildControlComponentsIndex: () => { [name: string]: any } = () => ({
  assoc: AssociationControl,
  calendar: CalendarControl,
  date: DateControl,
  integer: IntegerControl,
  text: TextControl,
  list: ListControl,

  // 'group-row': FieldsGroupRow,
});
