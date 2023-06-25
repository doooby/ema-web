import BooleanControl from './Boolean.vue';
import CalendarControl, { type as CalendarControlType } from './Calendar.vue';
import DateControl, { type as DateControlType } from './Date.vue';
import ImageFile from './ImageFile.vue';
import IntegerControl, { type as IntegerControlType } from './Integer.vue';
import SelectControl from './Select.vue';
import SelectMultipleControl from './SelectMultiple.vue';
import SelectOrFillControl from './SelectOrFill.vue';
import TextControl, { type as TextControlType } from './Text.vue';
import NameControl from './Name.vue';
import TextMultilineControl, { type as TextMultilineControlType } from './TextMultiline.vue';
import LocationControl from './Location/Location.vue';
import { FormFieldType } from '~/components/Form';

export function asFieldType (component: any): FormFieldType {
  const type = component.fieldType;
  if (!type) {
    throw new Error('invalid field');
  }
  return { ...type, control: component };
}

export const controlsIndex2 = {
  boolean: asFieldType(BooleanControl),
  calendar: { ...CalendarControlType, control: CalendarControl },
  date: { ...DateControlType, control: DateControl },
  imageFile: asFieldType(ImageFile),
  integer: { ...IntegerControlType, control: IntegerControl },
  location: asFieldType(LocationControl),
  name: asFieldType(NameControl),
  select: asFieldType(SelectControl),
  selectMultiple: asFieldType(SelectMultipleControl),
  selectOrFill: asFieldType(SelectOrFillControl),
  text: { ...TextControlType, control: TextControl },
  textMultiline: { ...TextMultilineControlType, control: TextMultilineControl },
};
