<template>
  <div>
    <top-bar />
    <div class="page-body">
      <div class="page-menu">
        <h2>Database</h2>
      </div>
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  head: {
    bodyAttrs: {
      class: 'body-database',
    },
  },

});
</script>
