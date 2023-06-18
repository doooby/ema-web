<template>
  <IndexPage
    entity="subjects"
    :search-fields="searchFields"
    :actions="actions"
    :component="component"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import RecordsListing from '~/components/database/records/subjects/RecordsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  component=RecordsListing;

  searchFields =[
    [ 'search', controls.text ],
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
