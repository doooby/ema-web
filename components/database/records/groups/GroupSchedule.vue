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
        <h4>Subjects</h4>
        <div
          v-for="{subject, occurs, required} in subjects"
          :key="subject.id"
          class="em-2 epy-2 epx-3 border"
        >
          {{ subject.name_en }}
          <br>
          <small>{{ subject.name }}</small>
          <div class="d-flex align-items-center justify-content-between">
            <b-button class="border-0" size="sm" variant="outline-secondary" @click="onApplySubject(subject)">
              <b-icon icon="box-arrow-in-left" />
            </b-button>
            <div :class="occurs < required ? 'text-danger' : 'text-success'">
              {{ occurs }} / {{ required }}
            </div>
          </div>
        </div>
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
import fnsFormat from 'date-fns/format';
import { PaginatedRecords } from '~/lib/api/mappers';

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

  getSubjectsQueryState = this.$api.newQueryState<PaginatedRecords<Subject>>();

  currenDate = simplifyDate(new Date());

  tableColumns = [
    { name: 'date', slot: 'day' },
    { name: 'subjects', slot: 'subjects' },
  ];

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
      list.push({
        id: index,
        date: addDays(this.currenDate, index),
        subjects: [],
      });
    }
    return list;
  }

  get subjects (): SubjectRequirements[] {
    const { records } = this.getSubjectsQueryState.value ?? {};
    return (records ?? []).map(subject => ({
      subject,
      occurs: 0,
      required: 20,
    }));
  }

  onDateChange (date: Date): void {
    this.currenDate = simplifyDate(date);
  }

  onApplySubject (subject: Subject): void {

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
