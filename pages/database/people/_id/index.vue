<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import GroupsListing from '~/components/database/records/people/GroupsListing.vue';
import WorkAgreementsListing from '~/components/database/records/people/WorkAgreementsListing.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';
import { person } from '~/lib/records';

enum Tabs {
  groups,
  work_agreements,
}

@Component({
  components: {
    RecordAssociations,
    WorkAgreementsListing,
    GroupsListing,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
  },
})
export default class extends DatabasePage {
  Tabs = Tabs;
  currenTab: Tabs = Tabs.groups;

  mainGroupAssociations = person.mainGroupAssociations();
  mainContractAssociations = person.mainContractAssociations();
}
</script>

<template>
  <show2-page
    entity="people"
  >
    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/people/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.people.label.student_kobo_no">
          {{ record.student_kobo_no }}
        </show-page-table-row>
        <show-page-table-row label="db.record.people.label.external_id">
          {{ record.external_id }}
        </show-page-table-row>
        <show-page-table-row label="db.record.people.label.navision_id">
          {{ record.navision_id }}
        </show-page-table-row>
        <show-page-table-row label="db.record.people.label.last_name">
          {{ record.last_name?.[1] }}
          <br>
          <small>{{ record.last_name?.[0] }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.people.label.first_name">
          {{ record.first_name[1] }}
          <br>
          <small>{{ record.first_name[0] }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.people.label.born_on">
          {{ $d(record.born_on) }}
        </show-page-table-row>
        <show-page-table-row v-if="record.main_group" label="db.record.people.label.main_group">
          <RecordAssociations
            :record="record"
            :associations="mainGroupAssociations"
          />
        </show-page-table-row>
        <show-page-table-row v-if="record.main_contract" label="db.record.people.label.main_contract">
          <RecordAssociations
            :record="record"
            :associations="mainContractAssociations"
          />
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <b-tabs v-model="currenTab" content-class="emt-3 emb-6" no-fade>
        <b-tab>
          <template #title>
            <t value="db.record.groups.meta.p" />
          </template>
          <div v-if="currenTab === Tabs.groups">
            <groups-listing :person="record" />
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            <t value="db.record.work_agreements.meta.p" />
          </template>
          <div v-if="currenTab === Tabs.work_agreements">
            <work-agreements-listing :person="record" />
          </div>
        </b-tab>
      </b-tabs>
    </template>
  </show2-page>
</template>
