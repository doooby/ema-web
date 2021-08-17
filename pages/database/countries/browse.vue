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
        { name: 'name', control: 'text' },
      ],
      tableColumns: [
        { name: 'id' },
        { name: 'name' },
      ],
    };
  },
});
</script>
