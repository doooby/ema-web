<template>
  <div class="page-content -has-submenu">
    <div class="page-menu">
      <search-form />
    </div>
    <div>
      database
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SearchForm from '@lib/database/users/SearchForm.vue';

export default Vue.extend({
  components: {
    SearchForm,
  },
  layout: 'database',
});
</script>
