<template>
  <index-page
    entity="people"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage from '~/components/database/page/index/IndexPage.vue';
import { FormFieldDefinition } from '~/components/Form';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import Date from '~/components/database/cells/Date.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
      [ 'search', 'text' ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, entity: 'people' }, size: 60 },
    { name: 'family_name_en' },
    { name: 'family_name' },
    { name: 'given_name_en' },
    { name: 'given_name' },
    { name: 'born_on', cell: { type: Date } },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
