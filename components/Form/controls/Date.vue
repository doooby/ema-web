<template>
  <b-form-group
    :label="labelText"
  >
    <div class="d-flex justify-content-between">
      <div class="d-flex align-items-center">
        {{ $t('form.field.date.day') }}
        <b-form-select
          v-model="day"
          class="eml-2 epx-2 ew-9 control-like"
          :options="dayOptions"
        />
      </div>
      <div class="d-flex align-items-center">
        {{ $t('form.field.date.month') }}
        <b-form-select
          v-model="month"
          class="eml-2 epx-2 ew-9 control-like"
          :options="monthOptions"
        />
      </div>
      <div class="d-flex align-items-center">
        {{ $t('form.field.date.year') }}
        <b-form-select
          v-model="year"
          class="eml-2 epx-2 ew-11 control-like"
          :options="yearOptions"
        />
      </div>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import times from 'lodash/times';
import reverse from 'lodash/reverse';
import { parseISO as parseDate } from 'date-fns';
import { FIELD_PROPS } from '../constants';
import { fieldCaptionGet } from '..';

const DAY_OPTIONS = times(31, val => val + 1);
const MONTHS_OPTIONS = times(12, val => val + 1);
const YEARS_OPTIONS = reverse(times(50, val => 2020 - val));

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    return {
      day: null,
      month: null,
      year: null,
      dayOptions: DAY_OPTIONS,
      monthOptions: MONTHS_OPTIONS,
      yearOptions: YEARS_OPTIONS,
    };
  },
  computed: {
    labelText (): string {
      return this.$t(fieldCaptionGet(this.field)) as string;
    },
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
      this.$emit('change', isNaN(date as any) ? undefined : date);
    },
  },
});
</script>
