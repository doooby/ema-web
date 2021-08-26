<template>
  <browse-page
    entity="countries"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import BrowsePage from '~/components/database/BrowsePage.vue';

export default Vue.extend({
  components: { BrowsePage },
  layout: 'database',
  data () {
    return {
      searchFields: [
        [ 'name', 'text' ],
      ],
      tableColumns: [
        { name: 'id', cell: { type: 'link', entity: 'subjects', onlyId: true }, size: 60 },
        { name: 'name' },
      ],
    };
  },
});
</script>
