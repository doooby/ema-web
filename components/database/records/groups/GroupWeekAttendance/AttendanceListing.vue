<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { application_record, group } from '~/lib/records';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import PrintFullName from '~/components/database/records/people/PrintFullName.vue';
import { Column } from '~/components/DataTable/v3';
import app from '~/lib/app';
import { WeekAttendance } from '~/lib/records/group/attendance';
import DayAttendance from '~/components/database/records/groups/GroupWeekAttendance/DayAttendance.vue';
import CheckBox from '~/components/controls/inputs/base/CheckBox.vue';

export interface Day {
  index: number;
  included: boolean;
  date: Date;
  column: Column;
  session?: boolean;
  sessionChanged?: boolean;
}

@Component({
  components: {
    CheckBox,
    DayAttendance,
    PrintFullName,
    ARecordLink,
    RecordErrors,
    ARecordsListing,
  },
})
export default class AttendanceListing extends Vue {
  @Prop({ required: true }) readonly originalAttendance!: app.Maybe<WeekAttendance['students']>;
  @Prop({ required: true }) readonly attendance!: app.Maybe<WeekAttendance['students']>;
  @Prop({ required: true }) readonly originalSessions!: app.Maybe<app.List<boolean>>;
  @Prop({ required: true }) readonly sessions!: app.Maybe<app.List<boolean>>;
  @Prop({ required: true }) readonly attendanceOptions!: app.List<{ value: string, text: string }>;
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly days!: Day[];

  columns = this.buildColumns();

  get listingParams () {
    return { group_id: this.group.id };
  }

  get sessionDays () {
    return this.days.map((day) => {
      const currentSession = this.sessions?.[day.index];
      const originalSession = this.originalSessions?.[day.index];
      return {
        ...day,
        session: currentSession ?? originalSession ?? false,
        sessionChanged: currentSession !== undefined && originalSession !== currentSession,
      };
    });
  }

  @Watch('sessionDays')
  onDaysChange () {
    this.columns = this.buildColumns();
  }

  buildColumns () {
    return [
      ...application_record.fillDataTableColumns('people', [
        { name: 'person', size: 200 },
      ]),
      ...this.days.map(({ column }) => column),
    ];
  }
}
</script>

<template>
  <ARecordsListing
    entity="people"
    :columns="columns"
    :actions-size="0"
    :params="listingParams"
    :static-per-page="100"
    :default-sort="[ 'first_name_lo', 'asc' ]"
    @load="$emit('pageLoad', $event)"
  >
    <template #prepend-body>
      <tr>
        <td colspan="3" />
        <td
          v-for="day in sessionDays"
          :key="day.index"
        >
          <div
            v-if="day.included"
            class="d-flex justify-content-center"
          >
            <div
              :class="[
                'p-1',
                day.sessionChanged && 'border border-warning',
              ]"
            >
              <CheckBox
                :value="day.session"
                @change="$emit('setSession', {
                  index: day.index,
                  happens: $event,
                })"
              >
                <t
                  class="font-12 text-muted"
                  value="records.groups.GroupWeekAttendance.AttendanceListing.sessionDay"
                />
              </CheckBox>
            </div>
          </div>
        </td>
      </tr>
    </template>
    <template #row="{ record }">
      <td>
        <div class="d-flex align-items-center">
          <a-record-link
            :id="record.id"
            class="mx-2"
            entity="people"
          />
          <PrintFullName :person="record" />
        </div>
      </td>
      <td
        v-for="day in sessionDays"
        :key="day.index"
        :class="[
          { 'ema--data-table--td__empty': !day.session || !day.included },
        ]"
      >
        <div v-if="day.session && day.included" class="px-2">
          <DayAttendance
            :original-value="originalAttendance?.[record.id]?.[day.index]"
            :current-value="attendance?.[record.id]?.[day.index]"
            :options="attendanceOptions"
            @change="$emit('input', [
              record.id,
              day.index,
              $event,
            ])"
          />
        </div>
      </td>
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </ARecordsListing>
</template>
