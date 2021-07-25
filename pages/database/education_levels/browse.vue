<template>
  <browse-page
    entity="education_levels"
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
        { name: 'id', size: 60 },
        { name: 'order' },
        { name: 'name' },
        { name: 'start_age' },
        { name: 'years_length' },
      ],
    };
  },
});
</script>
