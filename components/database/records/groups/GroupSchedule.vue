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
        <div
          v-for="{subject, occurs, required} in subjects"
          :key="subject.id"
          class="em-2 epy-2 epx-3 border bg-light"
        >
          <h4 class="em-0">
            {{ subject.name }}
          </h4>
          <small>{{ subject.name_en }}</small>
          <div class="d-flex align-items-center justify-content-between">
            <b-button
              class="border-0"
              size="sm"
              variant="outline-secondary"
              @click="onOpenModal(subject)"
            >
              <b-icon icon="box-arrow-in-left" />
            </b-button>
            <div :class="occurs < required ? 'text-danger' : 'text-success'">
              {{ occurs }} / {{ required }}
            </div>
          </div>
        </div>
        <group-schedule-apply-subject-modal
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
import startOfWeek from 'date-fns/startOfWeek';
import addDays from 'date-fns/addDays';
import addWeeks from 'date-fns/addWeeks';
import isSameDay from 'date-fns/isSameDay';
import fnsFormat from 'date-fns/format';
import { PaginatedRecords } from '~/lib/api/mappers';
import GroupScheduleApplySubjectModal from '~/components/database/records/groups/GroupScheduleApplySubjectModal.vue';

interface SubjectRequirements {
  subject: Subject;
  occurs: number;
  required: number;
}

interface DaySchedule {
  id: number;
  date: Date;
  subjects: Subject[];
}

interface Occurrence {
  subject: Subject;
  date: Date;
}

function simplifyDate (date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 0 });
}

@Component({
  components: {
    GroupScheduleControls,
    GroupScheduleApplySubjectModal,
  },
})
export default class GroupSchedule extends Vue {
  @Prop({ required: true }) readonly group!: Group;

  getSubjectsQueryState = this.$api.newQueryState<PaginatedRecords<Subject>>();

  currenDate = simplifyDate(new Date());

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

  get days (): DaySchedule[] {
    const list = [] as DaySchedule[];
    for (let index = 0; index < 8; index += 1) {
      const dayDate = addDays(this.currenDate, index);
      const subjects = this.occurrences
        .filter(({ date }) => isSameDay(dayDate, date))
        .map(({ subject }) => subject);
      list.push({
        id: index,
        date: dayDate,
        subjects,
      });
    }
    return list;
  }

  get subjects (): SubjectRequirements[] {
    const { records } = this.getSubjectsQueryState.value ?? {};
    return (records ?? []).map(subject => ({
      subject,
      occurs: 0,
      required: 2,
    }));
  }

  onDateChange (date: Date): void {
    this.currenDate = simplifyDate(date);
  }

  onOpenModal (subject: Subject): void {
    this.applySubject = subject;
    this.applyModalShown = true;
  }

  onApplySubject (res: any) {
    const startDate = this.currenDate;
    for (let index = 0; index < 10; index += 1) {
      this.occurrences.push({
        subject: res.subject,
        date: addDays(addWeeks(startDate, index), 1),
      });
    }
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
