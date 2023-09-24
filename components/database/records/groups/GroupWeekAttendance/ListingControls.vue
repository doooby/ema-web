<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { group } from '~/lib/records';
import { formatDate } from '~/lib/global_utils';
import { isMonday, subDays } from 'date-fns';
import app from '~/lib/app';

export interface Model {
  currentDate: app.Maybe<Date>;
}

@Component({
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
  <div class="border p-3">
    no-control (date: {{ formatDate(value.currentDate) }})
  </div>
</template>
