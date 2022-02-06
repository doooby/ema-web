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
import RecordLink from '~/components/database/cells/RecordLink.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', 'text' ],
  ];

  tableColumns = [
    { name: 'id', cell: { type: RecordLink, onlyId: true }, size: 60 },
    { name: 'name_en' },
    { name: 'name' },
  ];
}
</script>
