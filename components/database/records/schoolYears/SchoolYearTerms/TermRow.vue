<template>
  <div class="d-flex justify-content-between emb-2">
    <div class="d-flex align-items-center flex-fill emr-1">
      <span class="emr-2">
        {{ index + 1 }}.
      </span>
      <span class="emr-2">
        <t value="app.common.label.from" />
      </span>
      <b-form-datepicker
        :value="term.from"
        label-no-date-selected=""
        :date-format-options="dateFormat"
        @input="onChangeFrom"
      />
    </div>
    <div class="d-flex align-items-center flex-fill eml-1">
      <span class="emr-2">
        <t value="app.common.label.to" />
      </span>
      <b-form-datepicker
        :value="term.to"
        label-no-date-selected=""
        :date-format-options="dateFormat"
        @input="onChangeTo"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Term } from './index.vue';
import { parseISO as parseDate } from 'date-fns';

const dateFormat = Object.freeze({ year: 'numeric', month: 'numeric', day: 'numeric' });

@Component
export default class TermRow extends Vue {
  @Prop({ required: true }) term!: Term;
  @Prop({ required: true }) index!: number;
  dateFormat = dateFormat;

  onChangeFrom (rawDate: string) {
    let date: any = parseDate(rawDate);
    date = isNaN(date as any) ? undefined : date;
    this.$emit('change', { ...this.term, from: date });
  }

  onChangeTo (rawDate: string) {
    let date: any = parseDate(rawDate);
    date = isNaN(date as any) ? undefined : date;
    this.$emit('change', { ...this.term, to: date });
  }
}
</script>
