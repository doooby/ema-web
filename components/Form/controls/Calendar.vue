<template>
  <b-form-group
    :label="label"
    :label-for="domId"
  >
    <b-form-datepicker
      :id="domId"
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
import { FIELD_PROPS } from '..';

export default Vue.extend({
  props: FIELD_PROPS,
  computed: {
    sanitizedValue (): undefined | Date {
      const rawValue = this.formValues[this.field[0]];
      return (rawValue instanceof Date && !isNaN(rawValue as any))
        ? rawValue
        : undefined;
    },
  },
  methods: {
    onDateChange (rawDate: string) {
      const date = parseDate(rawDate);
      this.$emit('change', isNaN(date as any) ? undefined : date);
    },
  },
});
</script>
