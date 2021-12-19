<template>
  <index-page
    entity="countries"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage from '~/components/database/page/index/IndexPage.vue';

@Component({
  components: { IndexPage },
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
