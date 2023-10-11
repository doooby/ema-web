<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import StudentsListing from '~/components/database/records/groups/StudentsListing/StudentsListing.vue';
import GroupGrades from '~/components/database/records/groups/GroupGrades/index.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import ConfirmArchiveModal from '~/components/database/modals/ConfirmArchiveModal.vue';
import EditAction from '~/components/database/components/detail/actions/EditAction.vue';
import ArchiveAction from '~/components/database/components/detail/actions/ArchiveAction.vue';
import { course, group } from '~/lib/records';
import { RequestResponse, SearchRecordsResponsePayload } from '~/lib/api2';
import GroupWeekAttendance from '~/components/database/records/groups/GroupWeekAttendance/GroupWeekAttendance.vue';

enum Tabs {
  students,
  attendance,
  grading
}

@Component({
  components: {
    GroupWeekAttendance,
    ArchiveAction,
    EditAction,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    ShowRecordLink,
    StudentsListing,
    GroupGrades,
    TextNames,
    ConfirmArchiveModal,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.students;

  group: null | group.Group = null;

  courseLoader = this.$api2.createRecordLoader(this.onLoadCourse);

  get urlGenerateMonth (): string {
    return `/server/pdf/group_attendance/${this.group?.id}`;
  }

  onLoadCourse (): Promise<RequestResponse<SearchRecordsResponsePayload<course.Course>>> {
    return this.$api2.fetchRecord('courses', { id: this.group!.course.id });
  }
}
</script>

<template>
  <show2-page
    entity="groups"
    @load="group = $event"
  >
    <template #title="{ record }">
      {{ record.id }}
    </template>

    <template #actions="{ record, reloadRecord }">
      <ul>
        <EditAction
          v-if="$admission.can('groups.update')"
          entity="groups"
          :record="record"
        />
        <ArchiveAction
          v-if="$admission.can('groups.archive')"
          entity="groups"
          :record="record"
          @archived="reloadRecord"
        />
        <li v-if="$admission.can('groups.generate_attendance')">
          <a
            class="btn btn-link d-flex align-items-center"
            :href="urlGenerateMonth"
            target="_blank"
          >
            <b-icon icon="file-pdf" class="emr-4" />
            <t value="db.record.groups.actions.generate_month_attendance" />
          </a>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.groups.label.name">
          <text-names :value="record.name" />
        </show-page-table-row>
        <show-page-table-row label="db.record.groups.label.course">
          <show-record-link
            entity="courses"
            :record="{ id: record.course.id, caption: record.course.caption }"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.groups.label.school">
          <show-record-link
            entity="schools"
            :record="{ id: record.school.id, caption: record.school.caption }"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.groups.label.term">
          {{ record.term }}
          <div v-if="record.term_dates">
            {{ $ema.localizeDate(record.term_dates[0]) }}
            -
            {{ $ema.localizeDate(record.term_dates[1]) }}
          </div>
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currenTab" content-class="emt-3 emb-6" no-fade>
        <b-tab>
          <template #title>
            <t value="db.record.groups.label.students" />
          </template>
          <div v-if="currenTab === Tabs.students">
            <students-listing :group="record" />
          </div>
        </b-tab>
        <b-tab title="Attendance">
          <div v-if="currenTab === Tabs.attendance">
            <GroupWeekAttendance
              :group="record"
              :course-loader="courseLoader"
            />
          </div>
        </b-tab>
        <b-tab title="Grading">
          <div v-if="currenTab === Tabs.grading">
            <GroupGrades
              :group="record"
              :course-loader="courseLoader"
            />
          </div>
        </b-tab>
      </b-tabs>
    </template>
  </show2-page>
</template>
