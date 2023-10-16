<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { course, group } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { RecordLoader } from '~/lib/api2';
import { formatDate } from '~/lib/global_utils';
import LoadingBlock from '~/components/database/components/LoadingBlock.vue';
import ListingControls, { Model } from './ListingControls.vue';
import app from '~/lib/app';
import AttendanceListing, { Day } from '~/components/database/records/groups/GroupWeekAttendance/AttendanceListing.vue';
import { times } from 'lodash';
import { addDays, isSameDay, isWithinInterval } from 'date-fns';
import { h } from 'vue';
import DayColumnHeader from '~/components/database/records/groups/GroupWeekAttendance/DayColumnHeader.vue';
import CardSaveableFooter from '~/components/database/components/CardSaveableFooter.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { ResourceError } from '~/vendor/wai/mappers';

@Component({
  components: {
    RecordErrors,
    CardSaveableFooter,
    AttendanceListing,
    LoadingBlock,
    ListingControls,
  },
})
export default class GroupWeekAttendance extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly courseLoader!: RecordLoader<course.Course>;

  controlsModel: Model = {
    inputDate: undefined,
    currentDate: undefined,
  };

  showWeek = this.$api2.newCachedQueryState<
    wai.ResourceShow<group.attendance.WeekAttendance>
  >();

  updateWeek = this.$api2.newQueryState<wai.ResourceUpdate>();

  attendance: {
    value: app.Maybe<group.attendance.WeekAttendance['students']>;
  } = {
    value: undefined,
  };

  studentRecords: null | any[] = null;

  async mounted () {
    await Promise.resolve();

    if (!this.courseLoader.state.response) {
      await this.courseLoader.load();
    }
  }

  get course (): app.Maybe<course.Course> {
    const { response } = this.courseLoader.state;
    return response?.ok
      ? response.payload.records[0]
      : undefined;
  }

  get courseLoadFailMessage (): app.Maybe<string> {
    const { response } = this.courseLoader.state;
    return response?.ok === false ? 'app.processing.not_found' : undefined;
  }

  get termDates (): app.Maybe<{ begin: Date, end: Date }> {
    return this.course?.term_dates[this.group.term - 1];
  }

  get listedDays (): Day[] {
    const { currentDate } = this.controlsModel;
    if (!currentDate || !this.termDates) return [];
    const interval = { start: this.termDates.begin, end: this.termDates.end };
    return times(7, (index) => {
      const date = addDays(currentDate, index);
      return {
        index,
        date,
        included: isWithinInterval(date, interval),
        column: {
          name: `day_${index}`,
          size: 120,
          renderHeader: () => h(DayColumnHeader, {
            props: { date },
          }),
        },
      };
    });
  }

  get originalAttendance (): app.Maybe<group.attendance.WeekAttendance['students']> {
    return this.showWeek.currentPayload?.students;
  }

  get saveErrors (): app.Maybe<ResourceError[]> {
    return app.api.updateErrors(this.updateWeek.response);
  }

  get attendanceOptions (): app.List<{ value: string, text: string }> {
    return app
      .internalOptionsList2(this.$store.state.session.country, 'attendance')
      .map((option) => {
        if (!option) return undefined;
        return {
          value: option.value,
          text: `${option.value} ${this.$t(option.item)}`,
        };
      });
  }

  @Watch('group')
  @Watch('course')
  @Watch('controlsModel.currentDate')
  async onShowWeek () {
    if (this.controlsModel.currentDate) {
      await this.$api2.cachedRequest(
        this.showWeek,
        group.attendance.queries.show({
          group_id: this.group.id,
          date: formatDate(this.controlsModel.currentDate),
        }),
      );
    }

    this.attendance.value = undefined;
  }

  onPageLoad (records) {
    this.attendance.value = undefined;
    this.studentRecords = records;
  }

  onChangeValue (
    [ person_id, date_index, value ]: [ string, number, string ],
  ) {
    this.attendance.value = Object.freeze({
      ...this.attendance.value,
      [person_id]: Object.freeze(
        updateArrayAt(
          this.attendance.value?.[person_id] ?? [],
          date_index,
          value,
        ),
      ),
    }) as group.attendance.WeekAttendance['students'];

    const originalValue = this.originalAttendance?.[person_id]?.[date_index];
    const newValue = value === '-' ? undefined : value;
    if (newValue === originalValue) {
      const personData = updateArrayAt(
        this.attendance.value[person_id]!,
        date_index,
        undefined,
      );
      if (personData.every(day => !day)) {
        const newAttendance = {
          ...this.attendance.value,
          [person_id]: undefined,
        };
        if (Object.values(newAttendance).every(person => !person)) {
          this.attendance.value = undefined;
        } else {
          this.attendance.value = Object.freeze(newAttendance);
        }
      }
    }
  }

  async onSaveChanges () {
    let students = this.attendance.value;
    if (!students) return;

    students = { ...students };
    for (const student_id of Object.keys(students)) {
      const days = [ ...students[student_id]! ];
      padArrayWithBlanks(days);
      students[student_id] = days;
    }

    await this.$api2.request(
      this.updateWeek,
      group.attendance.queries.update({
        group_id: this.group.id,
        date: formatDate(this.controlsModel.currentDate),
        students,
      }),
    );

    if (app.api.updateSuccess(this.updateWeek.response)) {
      this.onShowWeek();
    }
  }

  onPrefillDay ({ value }) {
    const { inputDate } = this.controlsModel;
    if (!inputDate) return;
    const dateIndex = this.listedDays.findIndex(
      day => isSameDay(day.date, inputDate),
    );
    if (!dateIndex) return;

    for (const student of this.studentRecords ?? []) {
      this.onChangeValue([ student.id, dateIndex, value ]);
    }
  }
}

function updateArrayAt (array: unknown[], index: number, value: unknown): unknown[] {
  array = [ ...array ];
  array[index] = value;
  return array;
}

function padArrayWithBlanks (array: any) {
  for (let i = 0; i < array.length; i += 1) {
    array[i] = array[i] ?? '';
  }
}

</script>

<template>
  <LoadingBlock
    class="mt-3"
    :is-loading="!course"
    :fail-message="courseLoadFailMessage"
  >
    <ListingControls
      v-if="course"
      v-model="controlsModel"
      :group="group"
      :term="termDates"
      :attendance-options="attendanceOptions"
      @prefill="onPrefillDay"
    />
    <AttendanceListing
      v-if="course"
      :original-attendance="originalAttendance"
      :attendance="attendance.value"
      :attendance-options="attendanceOptions"
      :group="group"
      :days="listedDays"
      @input="onChangeValue($event)"
      @pageLoad="onPageLoad"
    >
      <template v-if="attendance.value" #footer>
        <CardSaveableFooter
          :disabled="showWeek.processing || updateWeek.processing"
          @submit="onSaveChanges"
          @cancel="attendance.value = undefined"
        >
          <template v-if="saveErrors" #fail-content>
            <RecordErrors entity="groups" :errors="saveErrors" />
          </template>
        </CardSaveableFooter>
      </template>
    </AttendanceListing>
  </LoadingBlock>
</template>
