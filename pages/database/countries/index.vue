<template>
  <browse-page
    entity="countries"
    :search-fields="searchFields"
    :table-columns="tableColumns"
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
    { name: 'id', cell: { type: 'link', onlyId: true }, size: 60 },
    { name: 'name_en' },
    { name: 'name' },
  ];
}
</script>
