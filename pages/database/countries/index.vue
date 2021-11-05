<template>
  <browse-page
    entity="countries"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import DatabasePageMixin from '~/components/mixins/DatabasePageMixin';
import BrowsePage from '~/components/database/BrowsePage.vue';

@Component({
  components: { BrowsePage },
})
export default class extends DatabasePageMixin {
  searchFields = [
    [ 'name', 'text' ],
  ];

  tableColumns = [
    { name: 'id', cell: { type: 'link', onlyId: true }, size: 60 },
    { name: 'name' },
  ];
}
</script>
