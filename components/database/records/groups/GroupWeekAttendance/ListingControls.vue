<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { group } from '~/lib/records';
import { addDays, isAfter, isBefore, isSunday, startOfMonth, subDays } from 'date-fns';
import app from '~/lib/app';
import { DateInput } from '~/components/controls/inputs';

export interface Model {
  inputDate: app.Maybe<Date>;
  currentDate: app.Maybe<Date>;
}

@Component({
  components: { DateInput },
  methods: { formatDate: utils.dateToParam },
})
export default class ListingControls extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly term!: app.Maybe<{ begin: Date, end: Date }>;
  @Prop({ required: true }) readonly value!: Model;
  @Prop({ required: true }) readonly attendanceOptions!: app.List<{ value: string, text: string }>;

  selectedPrefillValue = '';

  created () {
    this.selectedPrefillValue = this.attendanceOptions[0]?.value ?? '';
  }

  mounted () {
    this.onReset();
  }

  get computedAttendanceOptions () {
    return [
      { value: '', text: '' },
      ...this.attendanceOptions,
    ];
  }

  get printFilledAttendanceUrl () {
    const id = this.group?.id ?? '-1';
    const date = this.value.inputDate
      ? app.dateToParam(this.value.inputDate)
      : '-1';
    return `/server/pdf/group_attendance/${id}/${date}`;
  }

  @Watch('course')
  onReset () {
    this.onSelectDate(this.term?.begin);
  }

  onSelectDate (date?: Date) {
    this.$emit('input', {
      ...this.value,
      inputDate: date,
      currentDate: date ? closestSunday(date) : undefined,
    });
  }

  onSelectPreviousWeek () {
    let date = this.value.inputDate;
    if (!date || !this.term) return;
    date = subDays(closestSunday(date), 7);
    if (isBefore(date, this.term.begin)) date = this.term.begin;
    this.onSelectDate(date);
  }

  onSelectNextWeek () {
    let date = this.value.inputDate;
    if (!date || !this.term) return;
    date = addDays(closestSunday(date), 7);
    if (isAfter(date, this.term.end)) date = this.term.end;
    this.onSelectDate(date);
  }

  onStartDay () {
    if (!this.selectedPrefillValue) return;
    this.$emit('prefill', {
      value: this.selectedPrefillValue,
    });
  }
}

function closestSunday (date: Date): Date {
  if (isSunday(date)) {
    return date;
  } else {
    return subDays(date, date.getDay());
  }
}
</script>

<template>
  <div>
    <div class="row">
      <b-form-group
        class="col-md-4 col-lg-3"
        label-for="attendance__filters_date"
      >
        <template #label>
          <t value="db.record.groups.attendance.filters.date" />
        </template>
        <DateInput
          dom-id="attendance__filters_date"
          :disabled="!term"
          :value="value.inputDate"
          :min="term?.begin"
          :max="term?.end"
          @change="onSelectDate"
        />
        <div class="mt-1 d-flex">
          <div>
            <button
              class="btn btn-xs btn-outline-secondary"
              :disabled="!term"
              @click="onSelectPreviousWeek"
            >
              <b-icon icon="chevron-left" />
            </button>
          </div>
          <div class="ml-1">
            <button
              class="btn btn-xs btn-outline-secondary"
              :disabled="!term"
              @click="onSelectNextWeek"
            >
              <b-icon icon="chevron-right" />
            </button>
          </div>
        </div>
      </b-form-group>
      <div class="col-lg-6 mb-3">
        <label class="d-none d-lg-block">&nbsp;</label>
        <div class="d-flex">
          <button
            class="btn btn-sm btn-outline-secondary d-flex align-items-center"
            @click="onStartDay"
          >
            <b-icon
              icon="chevron-down"
              class="mr-2"
            />
            <t value="db.record.groups.attendance.btn_start_day" />
          </button>
          <div>
            <b-form-select
              v-model="selectedPrefillValue"
              :options="computedAttendanceOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-md-4 col-lg-3 mb-3">
        <label class="d-none d-lg-block">&nbsp;</label>
        <a
          class="btn btn-link p-0"
          :href="printFilledAttendanceUrl"
          target="_blank"
        >
          <b-icon icon="file-pdf-fill" />
          <t value="db.record.groups.attendance.print_filled" />
        </a>
      </div>
    </div>
  </div>
</template>
