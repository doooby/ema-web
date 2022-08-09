<template>
  <show-page
    entity="schools"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/schools/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.schools.label.name">
          {{ record.name_en }}
          <br>
          <small>{{ record.name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.label.school_id">
          {{ record.school_id }}
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.label.address" />
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currenTab" content-class="emt-3 emb-6" no-fade>
        <b-tab title="Courses">
          <div v-if="currenTab === Tabs.courses">
            <courses-listing :school="record" />
          </div>
        </b-tab>
        <b-tab title="Teachers">
          <div v-if="currenTab === Tabs.teachers" />
        </b-tab>
        <b-tab title="Staff">
          <div v-if="currenTab === Tabs.staff" />
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
import CoursesListing from '~/components/database/records/schools/CoursesListing.vue';

enum Tabs {
  courses,
  teachers,
  staff,
}

@Component({
  components: {
    ShowPage,
    ShowPageAction,
    ShowPageTableRow,
    CoursesListing,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.courses;
}
</script>
