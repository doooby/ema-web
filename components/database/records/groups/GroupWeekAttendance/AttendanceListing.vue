<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { group, student } from '~/lib/records';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import PrintFullName from '~/components/database/records/people/PrintFullName.vue';
import app from '~/lib/app';
import { WeekAttendance } from '~/lib/records/group/attendance';
import DayAttendance from '~/components/database/records/groups/GroupWeekAttendance/DayAttendance.vue';
import CheckBox from '~/components/controls/inputs/base/CheckBox.vue';
import { wai } from '~/vendor/wai';
import { DataTable, DataTableColumn } from '~/components/toolkit/DataTable';
import HeaderCell from '~/components/views/application/pages/index/HeaderCell.vue';
import RecordsTable from '~/components/views/application/RecordsTable/RecordsTable.vue';

function parseStudent (value) {
  return wai.object2(value, value => ({
    header: wai.property(value, 'header', student.parseHeader),
  }));
}

type Student = ReturnType<typeof parseStudent>;

export interface Day {
  index: number;
  included: boolean;
  date: Date;
  column: DataTableColumn;
  session?: boolean;
  sessionChanged?: boolean;
}

@Component({
  components: {
    RecordsTable,
    HeaderCell,
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

  students = new app.db.Records<Student>({
    params: {
      staticParams: {
        slices: [ 'header' ],
      },
      listingParams: {
        page: 1,
        per_page: 100,
        order_by: [ [ 'first_name_lo', 'ASC' ] ],
      },
    },
  });

  get columns () {
    return DataTable.flattenColumns(
      {
        name: 'person',
        size: 250,
        headerText: 'database.records.groups.GroupWeekAttendance.column.person',
      },
      ...this.days.map(({ column }) => column),
    );
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

  @Watch('group')
  async onLoadStudents () {
    await this.students.load(
      this.$api2,
      `/groups/${this.group.id}/students`,
      parseStudent,
    );
    this.$emit('pageLoad', this.students.okPayload?.records);
  }
}
</script>

<template>
  <div>
    <RecordsTable
      :resource="students"
      :columns="columns"
      :sort-options="{ name: 'students', options: [ 'id', 'first_name_lo' ] }"
      :load-on-mount="true"
      :hide-per-page="true"
      @change="onLoadStudents"
    >

      <template #prepend-records>
        <tbody>
          <tr>
            <td />
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
        </tbody>
      </template>

      <template #row="{ record }">
        <td>
          <HeaderCell
            :record="record"
            :path="`/database/people/${record.id}`"
            :name="record.header.name_local"
          />
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

      <template v-if="$slots.footer" #append-records="{ columnsCount }">
        <tbody>
          <tr>
            <td :colspan="columnsCount">
              <slot name="footer" />
            </td>
          </tr>
        </tbody>
      </template>

    </RecordsTable>
  </div>
</template>
