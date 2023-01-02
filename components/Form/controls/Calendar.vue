<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
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
import { FormFieldType, FormField, FormValues, FormGroupContext } from '..';
import ControlMixin from '../ControlMixin';

export const type: FormFieldType = {
  name: 'calendar',
  fillValues ({ name }, record, values) {
    values[name] = utils.sanitizedDate(record[name]);
    return values;
  },
  fillParams ({ name }, values, record) {
    const date = values[name];
    record[name] = date ? utils.formatDate(date) : '';
    record[name] = values[name] || '';
    return record;
  },
};
export default Vue.extend({
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
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
