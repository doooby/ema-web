<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import SchoolCoursesListing from '~/components/database/records/schools/SchoolCoursesListing.vue';
import EditAction from '~/components/database/components/detail/actions/EditAction.vue';
import AssociationList from '~/components/database/components/listing/AssociationList.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ButtonToPath from '~/components/views/application/buttons/ButtonToPath.vue';
import PrintLocations from '~/components/views/location/PrintLocations.vue';

enum Tabs {
  courses,
  staff,
}

@Component({
  components: {
    PrintLocations,
    ButtonToPath,
    TextNames,
    AssociationList,
    EditAction,
    BRecordLink,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    SchoolCoursesListing,
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
      <ul class="list-group">
        <li
          v-if="$admission.can('schools.update')"
          class="list-group-item d-flex p-1 border-0"
        >
          <ButtonToPath
            class="btn-outline-secondary border-0 flex-fill"
            :path="`/database/schools/${record.id}/edit`"
          >
            <b-icon icon="pencil" class="mr-3" />
            <t value="lexicon.to_edit" />
          </ButtonToPath>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.schools.label.name">
          <TextNames :value="record.name" />
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.label.external_id">
          {{ record.external_id }}
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.label.address">
          <PrintLocations
            :system="$ema.currentCountry?.locations?.address"
            :value="record.address"
          />
        </show-page-table-row>
        <show-page-table-row label="db.record.schools.label.director">
          <BRecordLink v-if="record.director" entity="people" :record="record.director" />
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.meta.p">
          <AssociationList entity="projects" :records="record.projects" />
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
            <SchoolCoursesListing :school="record" />
          </div>
        </b-tab>
        <!--        <b-tab title="Staff">-->
        <!--          <div v-if="currenTab === Tabs.staff" />-->
        <!--        </b-tab>-->
      </b-tabs>
    </template>
  </show2-page>
</template>
