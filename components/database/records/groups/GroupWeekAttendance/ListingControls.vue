<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { group } from '~/lib/records';
import { isSunday, subDays } from 'date-fns';
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

  selectedPrefillValue = null;

  mounted () {
    this.onReset();
  }

  get computedAttendanceOptions () {
    return [
      { value: '', text: '' },
      ...this.attendanceOptions,
    ];
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
    </b-form-group>

    <b-form-group
      class="col-md-4 col-lg-3"
      label-for="attendance__btn_start_day"
    >
      <template #label>
        &nbsp;
      </template>
      <div class="d-flex">
        <button
          class="flex-fill btn btn-sm btn-outline-secondary d-flex align-items-center"
          @click="onStartDay"
        >
          <b-icon
            icon="chevron-down"
            class="mr-2"
          />
          <t value="db.record.groups.attendance.btn_start_day" />
        </button>
        <b-form-select
          v-model="selectedPrefillValue"
          :style="{ width: '50px' }"
          :options="computedAttendanceOptions"
        />
      </div>
    </b-form-group>
  </div>
</template>
