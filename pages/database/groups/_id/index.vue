<template>
  <show2-page
    entity="groups"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record, reloadRecord }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/groups/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
        <li>
          <show-page-action
            icon="lock"
            @click="archiveModalShown = true"
          >
            <t value="db.components.modals.ConfirmArchiveModal.action" />
          </show-page-action>
          <confirm-archive-modal
            v-model="archiveModalShown"
            entity="groups"
            :record-id="record.id"
            @recordChanged="reloadRecord"
          />
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
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currenTab" content-class="emt-3 emb-6" no-fade>
        <b-tab title="Students">
          <div v-if="currenTab === Tabs.students">
            <students-listing :group="record" />
          </div>
        </b-tab>
        <b-tab title="Attendance">
          <div v-if="currenTab === Tabs.attendance">
            <group-attendance :group="record" />
          </div>
        </b-tab>
      </b-tabs>
    </template>
  </show2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import StudentsListing from '~/components/database/records/groups/StudentsListing/StudentsListing.vue';
import GroupAttendance from '~/components/database/records/groups/GroupAttendance/index.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import ConfirmArchiveModal from '~/components/database/modals/ConfirmArchiveModal.vue';

enum Tabs {
  students,
  attendance,
}

@Component({
  components: {
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    ShowRecordLink,
    StudentsListing,
    GroupAttendance,
    TextNames,
    ConfirmArchiveModal,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.students;
  archiveModalShown = false;

  termSpan = [
    new Date(2022, 1, 1),
    new Date(2022, 5, 30),
  ]
}
</script>
