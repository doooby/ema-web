<template>
  <div>
    <div class="emy-4">
      <group-schedule-controls
        :value="currenDate"
        :span="termSpan"
        @input="onDateChange"
      />
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
          <div class="d-flex align-items-center">
            <div
              v-for="(subject, index) in dataItem.subjects"
              :key="index"
              class="em-3 ep-1 border bg-primary text-white"
            >
              <h4 class="em-0">
                {{ subject.name }}
              </h4>
              <small>{{ subject.name_en }}</small>
            </div>
          </div>
        </template>
      </data-table-view>
      <div class="col-3">
        <h4>Subjects</h4>
        <subjects-listing
          :subjects="subjects"
          :occurrences="occurrences"
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import GroupScheduleControls from '~/components/database/records/groups/GroupScheduleControls.vue';
import { Group, Subject } from '~/lib/records';
import { PaginatedRecords } from '~/lib/api/mappers';
import ApplySubjectModal, { Result as AddSubjectResult } from '~/components/database/records/groups/GroupSchedule/ApplySubjectModal/index.vue';
import { times } from 'lodash';
import { addWeeks, addDays, isSameDay, format as fnsFormat, startOfWeek, eachWeekOfInterval, isAfter } from 'date-fns';
import SubjectsListing from './SubjectsListing.vue';

interface DaySchedule {
  id: number;
  date: Date;
  subjects: Subject[];
}

export interface Occurrence {
  subject: Subject;
  date: Date;
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

  getSubjectsQueryState = this.$api.newQueryState<PaginatedRecords<Subject>>();

  currenDate = simplifyDate(this.termSpan[0]);

  tableColumns = [
    { name: 'date', slot: 'day' },
    { name: 'subjects', slot: 'subjects', size: 500 },
  ];

  occurrences: Occurrence[] = [];

  applyModalShown = false;

  applySubject = null as null | Subject

  @Watch('group')
  onPageChanged () {
    this.reloadSubjects();
  }

  mounted () {
    this.reloadSubjects();
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  get subjects (): Subject[] {
    return this.getSubjectsQueryState.value?.records ?? [];
  }

  get days (): DaySchedule[] {
    return times(7, (index: number) => {
      const dayDate = addDays(this.currenDate, index);
      const subjects = this.occurrences
        .filter(({ date }) => isSameDay(dayDate, date))
        .map(({ subject }) => subject);
      return {
        id: index + 1,
        date: dayDate,
        subjects,
      };
    });
  }

  onDateChange (date: Date): void {
    this.currenDate = simplifyDate(date);
  }

  onOpenModal (subject: Subject): void {
    this.applySubject = subject;
    this.applyModalShown = true;
  }

  onApplySubject (values: AddSubjectResult) {
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
      this.occurrences.push({
        date,
        subject: values.subject,
      });
    }
  }

  onRemoveSubject (subject: Subject) {
    this.occurrences = this.occurrences.filter(
      occurrence => occurrence.subject !== subject,
    );
  }

  printDay (date: Date): string {
    return fnsFormat(date, 'EEEE');
  }

  reloadSubjects () {
    this.getSubjectsQueryState.reset();
    this.fetchSubjects();
  }

  async fetchSubjects () {
    const query = this.$api.queries.subjects.index;
    await this.$api.request(query({
      course_id: this.group.course.id,
      country_id: this.currentCountryId,
      per_page: 50,
    }), this.getSubjectsQueryState);
  }
}
</script>
