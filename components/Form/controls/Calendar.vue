<template>
  <b-form-group
    :label="labelTranslation"
    :label-for="domIdBase"
  >
    <b-form-datepicker
      :id="domIdBase"
      :value="sanitizedValue"
      label-no-date-selected=""
      :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
      @input="onDateChange"
    />
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { parseISO as parseDate } from 'date-fns';
import { FIELD_PROPS, FormFieldType, FormField, FormValues } from '..';
import ControlMixin from '../ControlMixin';

export const type: Omit<FormFieldType, 'control'> = {
  name: 'calendar',
  mapToValues ({ name }: FormField, record: any, values: FormValues = {}) {
    values[name] = utils.sanitizedDate(record[name]);
    return values;
  },
  mapToRecord ({ name }: FormField, values: FormValues, record: any = {}) {
    const date = values[name];
    record[name] = date ? utils.formatDate(date) : '';
    record[name] = values[name] || '';
    return record;
  },
};
export default Vue.extend({
  mixins: [ ControlMixin ],
  props: FIELD_PROPS,
  computed: {
    sanitizedValue (): undefined | Date {
      const rawValue = this.formValues[this.field.name];
      return (rawValue instanceof Date && !isNaN(rawValue as any))
        ? rawValue
        : undefined;
    },
  },
  methods: {
    onDateChange (rawDate: string) {
      const date = parseDate(rawDate);
      this.context.onChange({ [this.field.name]: isNaN(date as any) ? undefined : date });
    },
  },
});
</script>
