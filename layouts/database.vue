<template>
  <div>
    <top-bar />
    <div class="page-body">
      <div class="page-menu">
        <nuxt-link class="my-3" to="/database">Index</nuxt-link>
        <h2>Database</h2>
      </div>
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TopBar from '@c/database/TopBar.vue';

export default Vue.extend({
  components: {
    TopBar,
  },
  head: {
    bodyAttrs: {
      class: 'body-database',
    },
  },
});
</script>
