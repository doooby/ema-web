<template>
  <div>
    <div>
      <group-schedule-controls :value="currenDate" @input="onDateChange" />
    </div>
    <div class="d-flex">
      <data-table-view
        class="col-9"
        :columns="tableColumns"
        :dataset="days"
      >
        <template #day="{ dataItem }">
          <div class="single-row-cell">
            {{ printDay(dataItem.date) }}
            <br>
            <small>{{ $d(dataItem.date) }}</small>
          </div>
        </template>
        <template #subjects="{ dataItem }">
          {{ JSON.stringify(dataItem) }}
        </template>
      </data-table-view>
      <div class="col-3">
        subjects
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import GroupScheduleControls from '~/components/database/records/groups/GroupScheduleControls.vue';
import { Group, Subject } from '~/lib/records';
import startOfWeek from 'date-fns/startOfWeek';
import addDays from 'date-fns/addDays';
import fnsFormat from 'date-fns/format';

interface DaySchedule {
  id: number;
  date: Date;
  subjects: Subject[];
}

function simplifyDate (date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 0 });
}

@Component({
  components: {
    GroupScheduleControls,
  },
})
export default class GroupSchedule extends Vue {
  @Prop({ required: true }) readonly group!: Group;

  currenDate = simplifyDate(new Date());

  tableColumns = [
    { name: 'date', slot: 'day' },
    { name: 'subjects', slot: 'subjects' },
  ];

  get days (): DaySchedule[] {
    const list = [] as DaySchedule[];
    for (let index = 0; index < 8; index += 1) {
      list.push({
        id: index,
        date: addDays(this.currenDate, index),
        subjects: [],
      });
    }
    return list;
  }

  onDateChange (date: Date): void {
    this.currenDate = simplifyDate(date);
  }

  printDay (date: Date): string {
    return fnsFormat(date, 'EEEE');
  }
}
</script>
