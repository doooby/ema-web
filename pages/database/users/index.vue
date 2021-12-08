<template>
  <browse-page
    entity="users"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import BrowsePage from '~/components/database/BrowsePage.vue';

@Component({
  components: { BrowsePage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'name', 'text' ],
  ];

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
