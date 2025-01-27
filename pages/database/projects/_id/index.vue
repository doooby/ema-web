<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import ProjectSchoolsListing from '~/components/database/records/projects/ProjectSchoolsListing.vue';
import CoursesListing from '~/components/database/records/projects/CoursesListing.vue';
import AssociationList from '~/components/database/components/listing/AssociationList.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import PrintDateRange from '~/components/toolkit/PrintDateRange.vue';

enum Tabs {
  schools,
  courses,
}

@Component({
  components: {
    PrintDateRange,
    TextNames,
    AssociationList,
    ProjectSchoolsListing,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    BRecordLink,
    CoursesListing,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.schools;
}
</script>

<template>
  <show2-page
    entity="projects"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li v-if="$admission.can('projects.update')">
          <show-page-action
            icon="pencil"
            :path="`/database/projects/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.projects.label.name">
          <TextNames :value="record.name" />
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.full_name">
          <TextNames :value="record.full_name" />
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.code">
          {{ record.code }}
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.short_name_en">
          {{ record.short_name_en }}
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.duration">
          <PrintDateRange
            :dates="[
              record.starts_on,
              record.ends_on
            ]"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.donors">
          <AssociationList entity="donors" :records="record.donors" />
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currenTab" content-class="emt-3 emb-6" no-fade>
        <b-tab>
          <template #title>
            <t value="db.record.schools.meta.p" />
          </template>
          <div v-if="currenTab === Tabs.schools">
            <ProjectSchoolsListing :project="record" />
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            <t value="db.record.courses.meta.p" />
          </template>
          <div v-if="currenTab === Tabs.courses">
            <courses-listing :project="record" />
          </div>
        </b-tab>
      </b-tabs>
    </template>
  </show2-page>
</template>
