<template>
  <div class="d-flex align-items-center">
    <b-button
      variant="outline-secondary"
      class="emr-2"
      @click="onSetPreviousWeek"
    >
      <b-icon icon="chevron-left" />
    </b-button>
    <div style="max-width: 160px;">
      <b-form-datepicker
        :value="value"
        label-no-date-selected=""
        :min="startDate"
        :max="endDate"
        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        @input="onDateChange"
      />
    </div>
    <b-button variant="outline-secondary" class="eml-2" @click="onSetNextWeek">
      <b-icon icon="chevron-right" />
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import addWeeks from 'date-fns/addWeeks';
import { isAfter, isBefore, parseISO as parseDate, startOfWeek, endOfWeek } from 'date-fns';

@Component
export default class GroupScheduleControls extends Vue {
  @Prop({ required: true }) readonly value!: Date;
  @Prop({ required: true }) readonly span!: [Date, Date];

  startDate = startOfWeek(this.span[0], { weekStartsOn: 1 });
  endDate = endOfWeek(this.span[1], { weekStartsOn: 1 });

  onDateChange (rawDate: string): void {
    const date = parseDate(rawDate);
    this.$emit('input', isNaN(date as any) ? undefined : date);
  }

  onSetPreviousWeek (): void {
    const value = addWeeks(this.value, -1);
    if (isBefore(value, this.startDate)) return;
    this.$emit('input', value);
  }

  onSetNextWeek (): void {
    const value = addWeeks(this.value, 1);
    if (isAfter(value, this.endDate)) return;
    this.$emit('input', value);
  }
}
</script>
