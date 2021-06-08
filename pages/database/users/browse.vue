<template>
  <browse-page
    entity="users"
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
        { name: 'login' },
        { name: 'country', value: (user: any) => user.country.name },
        { name: 'full_name' },
      ],
    };
  },
});
</script>
