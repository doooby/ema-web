<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { group } from '~/lib/records';
import { formatDate } from '~/lib/global_utils';
import { isMonday, subDays } from 'date-fns';
import app from '~/lib/app';
import { DateInput } from '~/components/controls/inputs';

export interface Model {
  inputDate: app.Maybe<Date>;
  currentDate: app.Maybe<Date>;
}

@Component({
  components: { DateInput },
  methods: { formatDate },
})
export default class ListingControls extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly term!: app.Maybe<{ begin: Date, end: Date }>;
  @Prop({ required: true }) readonly value!: Model;

  mounted () {
    this.onReset();
  }

  @Watch('course')
  onReset () {
    this.onSelectDate(this.term?.begin);
  }

  onSelectDate (date?: Date) {
    this.$emit('input', {
      ...this.value,
      inputDate: date,
      currentDate: date ? closestMonday(date) : undefined,
    });
  }
}

function closestMonday (date: Date): Date {
  if (isMonday(date)) {
    return date;
  } else {
    return subDays(date, date.getDay() - 1);
  }
}
</script>

<template>
  <div class="row">
    <b-form-group
      class="col-md-4 col-lg-3"
      label-for="attendance_filters_date"
    >
      <template #label>
        <t value="db.records.group.attendance.filters.date" />
      </template>
      <DateInput
        dom-id="attendance_filters_date"
        :disabled="!term"
        :value="value.inputDate"
        :min="term?.begin"
        :max="term?.end"
        @change="onSelectDate"
      />
    </b-form-group>
  </div>
</template>
