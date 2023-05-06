import BooleanControl from './Boolean.vue';
import CalendarControl, { type as CalendarControlType } from './Calendar.vue';
import DateControl, { type as DateControlType } from './Date.vue';
import HiddenControl from './Hidden.vue';
import ImageFile from './ImageFile.vue';
import IntegerControl, { type as IntegerControlType } from './Integer.vue';
import ListControl from './List.vue';
import SelectControl from './Select.vue';
import SelectMultipleControl from './SelectMultiple.vue';
import SelectOrFillControl from './SelectOrFill.vue';
import TextControl, { type as TextControlType } from './Text.vue';
import NameControl from './Name.vue';
import TextMultilineControl, { type as TextMultilineControlType } from './TextMultiline.vue';
import LocationControl from './Location.vue';
import ListMultiple from '~/components/Form/controls/ListMultiple.vue';
import { FormFieldType } from '~/components/Form';

export const controlsIndex = {} as any;

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
add(HiddenControl.fieldType, HiddenControl);
add(ListControl.fieldType, ListControl);
add(SelectControl.fieldType, SelectControl);
add(SelectOrFillControl.fieldType, SelectOrFillControl);
add(TextControlType, TextControl);
add(TextMultilineControlType, TextMultilineControl);
add(LocationControl.fieldType, LocationControl);
add(ListMultiple.fieldType, ListMultiple);

export function asFieldType (component: any): FormFieldType {
  const type = component.fieldType;
  if (!type) {
    throw new Error('invalid field');
  }
  return { ...type, control: component };
}

export const controlsIndex2 = {
  name: asFieldType(NameControl),
  date: { ...DateControlType, control: DateControl },
  calendar: { ...CalendarControlType, control: CalendarControl },
  select: asFieldType(SelectControl),
  selectMultiple: asFieldType(SelectMultipleControl),
  selectOrFill: asFieldType(SelectOrFillControl),
  textMultiline: { ...TextMultilineControlType, control: TextMultilineControl },
  boolean: asFieldType(BooleanControl),
  imageFile: asFieldType(ImageFile),
  integer: { ...IntegerControlType, control: IntegerControl },
  text: { ...TextControlType, control: TextControl },
};
