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
      <div v-if="field.data && field.data.deletable">
        <b-button
          variant="default"
          class="eml-4 epx-2 control-like"
          @click="onClear"
        >
          <b-icon-x variant="secondary" />
        </b-button>
      </div>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { times, reverse, padStart } from 'lodash';
import { parseISO as parseDate } from 'date-fns';
import { FIELD_PROPS } from '../constants';
import { fieldCaptionGet } from '..';
import { BIconX } from 'bootstrap-vue';

const DAY_OPTIONS = times(31, val => val + 1);
const MONTHS_OPTIONS = times(12, val => val + 1);
const YEARS_OPTIONS = reverse(times(50, val => 2020 - val));

export default Vue.extend({
  components: { BIconX },
  props: FIELD_PROPS,
  data () {
    const date = sanitizedDate(this.formValues[this.field.name]);
    return {
      day: date ? date.getDate() : null,
      month: date ? date.getMonth() + 1 : null,
      year: date ? date.getFullYear() : null,
      dayOptions: DAY_OPTIONS,
      monthOptions: MONTHS_OPTIONS,
      yearOptions: YEARS_OPTIONS,
    };
  },
  computed: {
    labelText (): string {
      return this.$t(fieldCaptionGet(this.field)) as string;
    },
  },
  watch: {
    day (day: any) {
      if (typeof day !== 'number') return;
      const date = buildDate(this.year, this.month, day);
      this.onChange(date);
      if (!date) Vue.nextTick(() => { this.day = null; });
    },
    month (month: any) {
      if (typeof month !== 'number') return;
      const date = buildDate(this.year, month, this.day);
      this.onChange(date);
      if (!date) Vue.nextTick(() => { this.day = null; });
    },
    year (year: any) {
      if (typeof year !== 'number') return;
      const date = buildDate(year, this.month, this.day);
      this.onChange(date);
      if (!date) Vue.nextTick(() => { this.day = null; });
    },
  },
  methods: {
    onChange (date: undefined | Date): void {
      this.$emit('change', date);
    },
    onClear (): void {
      this.day = null;
      this.month = null;
      this.year = null;
    },
  },
});

function sanitizedDate (date: any): undefined | Date {
  return (date instanceof Date && !isNaN(date as any))
    ? date
    : undefined;
}

function buildDate (year: any, month: any, day: any): undefined | Date {
  month = month && padStart(month.toString(), 2, '0');
  day = day && padStart(day.toString(), 2, '0');
  return sanitizedDate(parseDate(`${year}-${month}-${day}`));
}
</script>
