<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import AddressText from '~/components/database/records/location_systems/AddressText.vue';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import CoursesListing from '~/components/database/records/schools/CoursesListing/CoursesListing.vue';
import ConfirmArchiveModal from '~/components/database/modals/ConfirmArchiveModal.vue';
import EditAction from '~/components/database/components/detail/actions/EditAction.vue';
import ArchiveAction from '~/components/database/components/detail/actions/ArchiveAction.vue';

enum Tabs {
  courses,
  staff,
}

@Component({
  components: {
    ArchiveAction,
    EditAction,
    BRecordLink,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    AddressText,
    CoursesListing,
    ConfirmArchiveModal,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.courses;
}
</script>

<template>
  <show2-page
    entity="schools"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record, reloadRecord }">
      <ul>
        <EditAction entity="schools" :record="record" />
        <ArchiveAction entity="schools" :record="record" @archived="reloadRecord" />
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
        <show-page-table-row label="db.record.schools.label.director">
          <b-record-link v-if="record.director" entity="people" :record="record.director" />
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currenTab" content-class="emt-3 emb-6" no-fade>
        <b-tab>
          <template #title>
            <t value="db.record.courses.meta.p" />
          </template>
          <div v-if="currenTab === Tabs.courses">
            <courses-listing :school="record" />
          </div>
        </b-tab>
        <!--        <b-tab title="Staff">-->
        <!--          <div v-if="currenTab === Tabs.staff" />-->
        <!--        </b-tab>-->
      </b-tabs>
    </template>
  </show2-page>
</template>
