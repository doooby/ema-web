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
import WorkAgreementsListing from '~/components/database/records/work_agreements/WorkAgreementsListing.vue';
import app from '~/lib/app';
import { dbFields } from '~/components/database/fields';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields () {
    return [
      [ 'search', controls.text ],
      [ 'school', dbFields.selectBRecord, {
        entity: 'schools',
      } ],
      [ 'position', controls.select, {
        options: app.extendOptionsList(
          app.internalOptionsList(this.$store.state.session.country, 'contract_position'),
          { empty: true },
        ),
      } ],
    ];
  }

  WorkAgreementsListing = WorkAgreementsListing;

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
