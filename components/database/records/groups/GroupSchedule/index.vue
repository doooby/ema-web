<template>
  <div class="d-flex">
    <div class="col-9">
      <div class="emy-4 d-flex justify-content-between">
        <group-schedule-controls
          :value="currenDate"
          :span="termSpan"
          @input="onDateChange"
        />
        <div class="d-flex align-items-center">
          <div v-if="changed" class="emr-2">
            <b-icon icon="exclamation-circle" />
            changed
          </div>
          <b-button
            :disabled="!changed || postScheduleQueryState.running"
            variant="primary"
            @click="postSchedule"
          >
            Save
          </b-button>
        </div>
      </div>
      <data-table-view
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
          <div class="d-flex align-items-center">
            <div
              v-for="(subject, index) in dataItem.subjects"
              :key="index"
              class="em-3 ep-1 border bg-primary text-white"
            >
              <h4 class="em-0">
                {{ subject.labels.name }}
              </h4>
              <small>{{ subject.labels.caption }}</small>
            </div>
          </div>
        </template>
      </data-table-view>
    </div>
    <div class="col-3">
      <h4>Subjects</h4>
      <subjects-listing
        v-if="schedule"
        :schedule="schedule"
        :weeks-count="weeks.length"
        @apply="onOpenModal($event)"
        @remove="onRemoveSubject($event)"
      />
      <apply-subject-modal
        v-if="applySubject"
        v-model="applyModalShown"
        :subject="applySubject"
        :date="currenDate"
        @submit="onApplySubject"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import GroupScheduleControls from '~/components/database/records/groups/GroupScheduleControls.vue';
import { Group, GroupSchedule as GroupScheduleT, Subject } from '~/lib/records';
import { AssociatedRecord, RecordChange } from '~/lib/api/mappers';
import ApplySubjectModal, { Result as AddSubjectResult } from '~/components/database/records/groups/GroupSchedule/ApplySubjectModal/index.vue';
import { times } from 'lodash';
import { addWeeks, addDays, isSameDay, format as fnsFormat, startOfWeek, eachWeekOfInterval, isAfter } from 'date-fns';
import SubjectsListing from './SubjectsListing.vue';

interface DaySchedule {
  id: number;
  date: Date;
  subjects: AssociatedRecord<Subject>[];
}

function simplifyDate (date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

@Component({
  components: {
    GroupScheduleControls,
    ApplySubjectModal,
    SubjectsListing,
  },
})
export default class GroupSchedule extends Vue {
  @Prop({ required: true }) readonly group!: Group;
  @Prop({ required: true }) readonly termSpan!: [Date, Date];

  schedule = null as null | GroupScheduleT.Definition;
  changed = false;
  getScheduleQueryState = this.$api.newQueryState<GroupScheduleT.Definition>();
  postScheduleQueryState = this.$api.newQueryState<RecordChange>();

  currenDate = simplifyDate(this.termSpan[0]);

  tableColumns = [
    { name: 'date', slot: 'day' },
    { name: 'subjects', slot: 'subjects', size: 500 },
  ];

  applyModalShown = false;
  applySubject = null as null | AssociatedRecord<Subject>

  @Watch('group')
  onPageChanged () {
    this.reloadSchedule();
  }

  mounted () {
    this.reloadSchedule();
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  get days (): DaySchedule[] {
    if (!this.schedule) return [];
    return times(7, (index: number) => {
      const dayDate = addDays(this.currenDate, index);
      const subjects = this.schedule!.occurrences
        .filter(({ date }) => isSameDay(dayDate, date))
        .map(({ subject }) => subject);
      return {
        id: index + 1,
        date: dayDate,
        subjects,
      };
    });
  }

  get weeks (): Date[] {
    return eachWeekOfInterval(
      { start: this.termSpan[0], end: this.termSpan[1] },
      { weekStartsOn: 1 },
    );
  }

  onDateChange (date: Date): void {
    this.currenDate = simplifyDate(date);
  }

  onOpenModal (subject: AssociatedRecord<Subject>): void {
    this.applySubject = subject;
    this.applyModalShown = true;
  }

  onApplySubject (values: AddSubjectResult) {
    if (!this.schedule) return;
    let weeks;
    if (values.recurrence.option === 'regular') {
      weeks = eachWeekOfInterval({ start: this.currenDate, end: this.termSpan[1] }, { weekStartsOn: 1 });
    } else {
      weeks = [];
      for (let index = 0; index < values.recurrence.times!; index += 1) {
        const nextValue = addWeeks(this.currenDate, index * values.recurrence.eachWeek!);
        if (isAfter(nextValue, this.termSpan[1])) break;
        weeks.push(nextValue);
      }
    }
    const occurrences = weeks.map(day => addDays(day, values.day));
    if (occurrences.length && isAfter(occurrences[occurrences.length - 1], this.termSpan[1])) {
      occurrences.pop();
    }
    for (const date of occurrences) {
      this.schedule.occurrences.push({
        date,
        subject: values.subject,
      });
    }
    this.changed = true;
  }

  onRemoveSubject (subject: AssociatedRecord<Subject>) {
    if (!this.schedule) return;
    this.schedule.occurrences = this.schedule.occurrences.filter(
      occurrence => occurrence.subject.id !== subject.id,
    );
    this.changed = true;
  }

  printDay (date: Date): string {
    return fnsFormat(date, 'EEEE');
  }

  async reloadSchedule () {
    this.getScheduleQueryState.reset();
    const query = this.$api.queries.groups.showSchedule;
    const result = await this.$api.request(query(
      this.group.id,
    ), this.getScheduleQueryState);
    this.schedule = result ?? {
      subjects: {},
      settings: undefined,
      occurrences: [],
    };
    this.changed = false;
  }

  async postSchedule () {
    if (!this.schedule) return;
    const result = await this.$api.request(this.$api.queries.groups.updateSchedule(
      this.group.id,
      this.schedule.occurrences.map(
        ({ subject, date }) => [ subject.id, fnsFormat(date, 'yyyy-MM-dd') ],
      ),
    ), this.postScheduleQueryState);
    if (result?.success) {
      this.changed = false;
    }
    this.postScheduleQueryState.reset();
  }
}
</script>
