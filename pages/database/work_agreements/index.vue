<template>
  <index-page
    entity="work_agreements"
    :search-fields="searchFields"
    :actions="actions"
    :component="WorkAgreementsListing"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import WorkAgreementsListing from '~/components/database/records/work_agreements/RecordsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
   searchFields = [
     [ 'search', controls.text ],
   ];

  WorkAgreementsListing = WorkAgreementsListing;

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
