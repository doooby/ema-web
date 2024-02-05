<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import StudentsListing from '~/components/database/records/groups/StudentsListing/StudentsListing.vue';
import GroupGrades from '~/components/database/records/groups/GroupGrades/index.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import EditAction from '~/components/database/components/detail/actions/EditAction.vue';
import { course, group } from '~/lib/records';
import { RequestResponse, SearchRecordsResponsePayload } from '~/lib/api2';
import GroupWeekAttendance from '~/components/database/records/groups/GroupWeekAttendance/GroupWeekAttendance.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';
import PrintDateRange from '~/components/toolkit/PrintDateRange.vue';
import AssignmentHistoryListing
  from '~/components/views/group/students_change/AssignmentHistoryListing.vue';
import DropoutsListing from '~/components/views/group/dropout/DropoutsListing.vue';
import LinkedGroups from '~/components/views/group/linked_groups/LinkedGroups.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import PageTab from '~/components/views/toolkit/PageTab.vue';
import ButtonToModal from '~/components/views/application/actions/ButtonToModal.vue';
import ArchiveRecord from '~/components/views/application/modals/ArchiveRecord.vue';
import HeaderRow, { RecordHeaderLabels } from '~/components/views/application/pages/show/HeaderRow.vue';

enum Tabs {
  none,
  students,
  assignment_history,
  attendance,
  grading,
  dropout,
}

@Component({
  components: {
    HeaderRow,
    ArchiveRecord,
    ButtonToModal,
    PageTab,
    RecordId,
    LinkedGroups,
    DropoutsListing,
    AssignmentHistoryListing,
    RecordAssociations,
    PrintDateRange,
    GroupWeekAttendance,
    EditAction,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    StudentsListing,
    GroupGrades,
    TextNames,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currentTab: Tabs = Tabs.none;

  group: null | group.Group = null;

  courseLoader = this.$api2.createRecordLoader(this.onLoadCourse);

  get urlGenerateMonth (): string {
    return `/server/pdf/group_attendance_empty/${this.group?.id}`;
  }

  get labels (): RecordHeaderLabels {
    const labels = new RecordHeaderLabels();
    if (this.group?.archived_at) labels.add({ name: 'archived' });
    return labels;
  }

  onLoadCourse (): Promise<RequestResponse<SearchRecordsResponsePayload<course.Course>>> {
    return this.$api2.fetchRecord('courses', { id: this.group!.course.id });
  }

  onLoadGroup (group) {
    this.group = group;

    if (this.currentTab === Tabs.none) {
      if (group.parent) {
        this.currentTab = Tabs.attendance;
      } else {
        this.currentTab = Tabs.students;
      }
    }
  }
}
</script>

<template>
  <show2-page
    entity="groups"
    @load="onLoadGroup"
  >
    <template #title />

    <template #actions="{ record }">
      <ul>
        <EditAction
          v-if="$admission.can('groups.update')"
          entity="groups"
          :record="record"
        />
        <li
          v-if="
            $ema.canI('act:/groups/actions/archive') &&
              !record.archived_at
          "
        >
          <ButtonToModal
            v-slot="{ shown }"
            class="btn-link"
            icon="lock"
          >
            <t value="lexicon.to_archive" />
            <ArchiveRecord
              v-model="shown.ref"
              entity="groups"
              :record-id="record.id"
              @archived="$router.push('/database/groups')"
            />
          </ButtonToModal>
        </li>
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
        <HeaderRow
          :record="record"
          :path="`/database/groups/${record.id}`"
          :names="record.name"
          :labels="labels"
        />
        <show-page-table-row label="db.record.groups.label.course">
          <RecordId
            class="font-14"
            :record="record.course"
            :path="`/database/courses/${record.course.id}`"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.groups.label.school">
          <RecordId
            class="font-14"
            :record="record.school"
            :path="`/database/schools/${record.school.id}`"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.groups.label.term">
          <RecordAssociations
            v-if="record.school_year"
            :record="record"
            :associations="[
              { entity: 'school_years', attr: 'school_year' },
            ]"
          />
          <div v-if="record.term_info">
            <div>
              <small>
                <t value="db.record.groups.caption.term" />&nbsp;:
              </small>
              {{ record.term_info[0] }}
            </div>
            <PrintDateRange
              v-if="record.term_dates"
              :dates="record.term_dates"
            />
          </div>
          <div v-else class="mt-1">
            <t value="db.record.groups.caption.is_non_classified" />
          </div>
        </show-page-table-row>
        <LinkedGroups :group="record" />
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs content-class="emt-3 emb-6" no-fade>
        <PageTab
          v-if="!record.parent"
          :id="Tabs.students"
          v-model="currentTab"
        >
          <template #title>
            <t value="db.record.groups.label.students" />
          </template>
          <template #content="{ present }">
            <StudentsListing v-if="present" :group="record" />
          </template>
        </PageTab>
        <PageTab
          v-if="!record.parent && $ema.canI('act:/groups/students_changes/index')"
          :id="Tabs.assignment_history"
          v-model="currentTab"
        >
          <template #title>
            <t value="db.pages.groups.show.tabs.assignment_history.title" />
          </template>
          <template #content="{ present }">
            <AssignmentHistoryListing v-if="present" :group="record" />
          </template>
        </PageTab>
        <PageTab
          :id="Tabs.attendance"
          v-model="currentTab"
        >
          <template #title>
            <t value="db.pages.groups.show.tabs.attendance.title" />
          </template>
          <template #content="{ present }">
            <GroupWeekAttendance
              v-if="present"
              :group="record"
              :course-loader="courseLoader"
            />
          </template>
        </PageTab>
        <PageTab
          :id="Tabs.grading"
          v-model="currentTab"
        >
          <template #title>
            <t value="db.pages.groups.show.tabs.grading.title" />
          </template>
          <template #content="{ present }">
            <GroupGrades
              v-if="present"
              :group="record"
              :course-loader="courseLoader"
            />
          </template>
        </PageTab>
        <PageTab
          v-if="!record.parent && $ema.canI('act:/groups/dropouts/index')"
          :id="Tabs.dropout"
          v-model="currentTab"
        >
          <template #title>
            <t value="db.pages.groups.show.tabs.dropout.title" />
          </template>
          <template #content="{ present }">
            <DropoutsListing
              v-if="present"
              :params="{ group_id: record.id }"
            />
          </template>
        </PageTab>
      </b-tabs>
    </template>
  </show2-page>
</template>
