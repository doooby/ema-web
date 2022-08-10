<template>
  <show-page
    entity="groups"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/groups/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.groups.label.name">
          {{ record.name_en }}
          <br>
          <small>{{ record.name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.groups.label.course">
          <show-record-link
            entity="courses"
            :record="{ id: record.course.id, caption: record.course.labels.caption }"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.groups.label.year">
          {{ record.year }}
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
  </show-page>
</template>

<script lang="ts">
import ShowPage from '~/components/database/ShowPage.vue';
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import StudentsListing from '~/components/database/records/groups/StudentsListing.vue';
import GroupAttendance from '~/components/database/records/groups/GroupAttendance/index.vue';

enum Tabs {
  students,
  attendance,
}

@Component({
  components: {
    ShowPage,
    ShowPageAction,
    ShowPageTableRow,
    ShowRecordLink,
    StudentsListing,
    GroupAttendance,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.students;

  termSpan = [
    new Date(2022, 1, 1),
    new Date(2022, 5, 30),
  ]
}
</script>
