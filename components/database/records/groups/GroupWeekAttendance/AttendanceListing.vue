<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import CardSaveableFooter from '~/components/database/components/CardSaveableFooter.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { application_record, group } from '~/lib/records';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import PrintFullName from '~/components/database/records/people/PrintFullName.vue';
import { Column } from '~/components/DataTable/v3';
import app from '~/lib/app';
import { WeekAttendance } from '~/lib/records/group/attendance';
import DayAttendance from '~/components/database/records/groups/GroupWeekAttendance/DayAttendance.vue';

export interface Day {
  index: number;
  included: boolean;
  date: Date;
  column: Column;
}

@Component({
  components: {
    DayAttendance,
    PrintFullName,
    ARecordLink,
    RecordErrors,
    CardSaveableFooter,
    ARecordsListing,
  },
})
export default class AttendanceListing extends Vue {
  @Prop({ required: true }) readonly originalAttendance!: app.Maybe<WeekAttendance['students']>;
  @Prop({ required: true }) readonly attendance!: app.Maybe<WeekAttendance['students']>;
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly days!: Day[];

  get listingParams () {
    return { group_id: this.group.id };
  }

  get columns () {
    return [
      ...application_record.fillDataTableColumns('people', [
        { name: 'person', size: 200 },
      ]),
      ...this.days.map(({ column }) => column),
    ];
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
}
</script>

<template>
  <ARecordsListing
    entity="people"
    :columns="columns"
    :actions-size="0"
    :params="listingParams"
  >
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
        v-for="day in days"
        :key="day.index"
        :class="{ 'bg-transparent': !day.included }"
      >
        <div v-if="day.included" class="px-2">
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
