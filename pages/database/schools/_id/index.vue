<template>
  <show-page
    entity="schools"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record, reloadRecord }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/schools/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
        <li>
          <archive-record-action
            entity="schools"
            :record-id="record.id"
            @archived="reloadRecord"
          >
            <t value="db.page.archive.action" />
          </archive-record-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.schools.label.name">
          {{ record.name[1] }}
          <br>
          <small>{{ record.name[0] }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.label.external_id">
          {{ record.external_id }}
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.label.director" />
        <show-page-table-row label="db.record.schools.label.address">
          <address-text :system="addressSystem" :address="record.address" />
        </show-page-table-row>
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
import ArchiveRecordAction from '~/components/database/ArchiveRecordAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import CoursesListing from '~/components/database/records/schools/CoursesListing.vue';
import AddressText from '~/components/database/records/location_systems/AddressText.vue';

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
    ArchiveRecordAction,
    AddressText,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.courses;

  get addressSystem () {
    return this.$store.state.session.countryData?.addressSystem;
  }
}
</script>
