<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="d-flex justify-content-between">
      <div class="d-flex align-items-center">
        <t value="form.field.date.day" />
        <b-form-select
          :value="day"
          class="eml-2 epx-2 ew-9 control-like"
          :options="dayOptions"
          @input="onDayChanged"
        />
      </div>
      <div class="d-flex align-items-center">
        <t value="form.field.date.month" />
        <b-form-select
          :value="month"
          class="eml-2 epx-2 ew-9 control-like"
          :options="monthOptions"
          @input="onMonthChanged"
        />
      </div>
      <div class="d-flex align-items-center">
        <t value="form.field.date.year" />
        <b-form-select
          :value="year"
          class="eml-2 epx-2 ew-11 control-like"
          :options="yearOptions"
          @input="onYearChanged"
        />
      </div>
      <div v-if="deletable">
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
import { FormFieldType, FormField, FormValues, FormGroupContext } from '..';
import { BIconX } from 'bootstrap-vue';
import ControlMixin from '../ControlMixin';

const DAY_OPTIONS = times(31, val => val + 1);
const MONTHS_OPTIONS = times(12, val => val + 1);
const YEARS_OPTIONS = reverse(times(50, val => 2030 - val));

export const type: FormFieldType = {
  name: 'date',
  mapToValues ({ name }: FormField, record: any, values: FormValues = {}) {
    values[name] = utils.sanitizedDate(record[name]);
    return values;
  },
  mapToRecordParams ({ name }: FormField, values: FormValues, record: any = {}) {
    const date = values[name];
    record[name] = date ? utils.formatDate(date) : '';
    record[name] = values[name] || '';
    return record;
  },
};

export default Vue.extend({
  components: { BIconX },
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  data () {
    const date = utils.sanitizedDate(this.formValues[this.field.name]);
    return {
      date,
      day: date ? date.getDate() : null,
      month: date ? date.getMonth() + 1 : null,
      year: date ? date.getFullYear() : null,
      dayOptions: DAY_OPTIONS,
      monthOptions: MONTHS_OPTIONS,
      yearOptions: YEARS_OPTIONS,
    };
  },
  computed: {
    deletable (): undefined | boolean {
      return this.field.options.deletable;
    },
  },
  watch: {
    // day (day: any) {
    //   // if (typeof day !== 'number') return;
    //   const date = buildDate(this.year, this.month, day);
    //   this.onChange(date);
    //   // if (!date) Vue.nextTick(() => { this.day = null; });
    // },
    // month (month: any) {
    //   // if (typeof month !== 'number') return;
    //   const date = buildDate(this.year, month, this.day);
    //   this.onChange(date);
    //   // if (!date) Vue.nextTick(() => { this.day = null; });
    // },
    // year (year: any) {
    //   // if (typeof year !== 'number') return;
    //   const date = buildDate(year, this.month, this.day);
    //   this.onChange(date);
    //   // if (!date) Vue.nextTick(() => { this.day = null; });
    // },
    formValues (newValues) {
      const date = utils.sanitizedDate(newValues[this.field.name]);
      this.date = date;
      this.day = date ? date.getDate() : null;
      this.month = date ? date.getMonth() + 1 : null;
      this.year = date ? date.getFullYear() : null;
    },
  },
  methods: {
    onDayChanged (value: any) {
      this.day = value;
      const date = buildDate(this.year, this.month, value);
      if (date) this.onChange(date);
    },
    onMonthChanged (value: any) {
      this.month = value;
      const date = buildDate(this.year, value, this.day);
      if (date) this.onChange(date);
    },
    onYearChanged (value: any) {
      this.year = value;
      const date = buildDate(value, this.month, this.day);
      if (date) this.onChange(date);
    },
    onChange (date: undefined | Date): void {
      this.context.onChange({ [this.field.name]: date });
    },
    onClear (): void {
      this.day = null;
      this.month = null;
      this.year = null;
      this.onChange(undefined);
    },
  },
});

function buildDate (year: any, month: any, day: any): undefined | Date {
  month = month && padStart(month.toString(), 2, '0');
  day = day && padStart(day.toString(), 2, '0');
  return utils.sanitizedDate(parseDate(`${year}-${month}-${day}`));
}
</script>
