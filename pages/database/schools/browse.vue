<template>
  <browse-page
    entity="schools"
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
        { name: 'country', value: (school: any) => school.country.name },
        { name: 'address' },
      ],
    };
  },
});
</script>
