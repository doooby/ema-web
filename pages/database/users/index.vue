<template>
  <index-page
    entity="users"
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
import AssociatedRecordLink from '~/components/database/cells/AssociatedRecordLink.vue';
import RecordLink from '~/components/database/cells/RecordLink.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    if (!this.currentUser) return [];
    const options = this.currentUser.countries.map(item => ({
      value: item.id,
      caption: item.labels.caption,
    }));
    return [
      [ 'country_id', 'list', { options, blank: true } ],
      [ 'search', 'text' ],
    ];
  }

  tableColumns = [
    { name: 'actions', slot: 'actions', headerText: false, size: 40 },
    { name: 'id', cell: { type: RecordLink, entity: 'users' }, size: 60 },
    {
      name: 'country',
      cell: { type: AssociatedRecordLink, entity: 'countries', noLink: true },
    },
    { name: 'login' },
    { name: 'full_name_en' },
    { name: 'full_name' },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
