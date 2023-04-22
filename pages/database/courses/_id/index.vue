<template>
  <show2-page
    entity="courses"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/courses/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.courses.label.name">
          {{ record.name_en }}
          <br>
          <small>{{ record.name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.grade">
          {{ record.grade }}
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.meta.s">
          <b-record-link entity="schools" :record="record.school" />
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.education_level">
          <b-record-link entity="education_levels" :record="record.education_level" />
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currenTab" content-class="emt-3 emb-6" no-fade>
        <b-tab title="Subjects">
          <div v-if="currenTab === Tabs.subjects">
            <subjects-listing :course="record" />
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            <t value="db.record.groups.meta.p" />
          </template>
          <div v-if="currenTab === Tabs.groups">
            <groups-listing :course="record" />
          </div>
        </b-tab>
      </b-tabs>
    </template>
  </show2-page>
</template>

<script lang="ts">
import { DatabasePage } from '~/components';
import { Component } from 'vue-property-decorator';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import SubjectsListing from '~/components/database/records/courses/SubjectsListing.vue';
import GroupsListing from '~/components/database/records/courses/GroupsListing.vue';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

enum Tabs {
  subjects,
  groups,
}

@Component({
  components: {
    BRecordLink,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    SubjectsListing,
    GroupsListing,
    ShowRecordLink,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.subjects;
}
</script>
