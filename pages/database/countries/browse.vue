<template>
  <browse-page
    entity="countries"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { BrowsePage } from '~/components/database';

export default Vue.extend({
  components: { BrowsePage },
  layout: 'database',
  data () {
    return {
      searchFields: [
        { name: 'name', controlType: 'text' },
      ],
      tableColumns: [
        { name: 'id' },
        { name: 'name' },
      ],
    };
  },
});
</script>
