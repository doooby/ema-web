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
    { name: 'id', cell: { type: 'link', entity: 'users' }, size: 60 },
    { name: 'country', getText: (user: any) => user.country?.caption },
    { name: 'login' },
    { name: 'full_name_en' },
    { name: 'full_name' },
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
