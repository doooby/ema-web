<template>
  <div>
    <top-bar />
    <div class="page-body">
      <resources-menu />
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TopBar from '~/components/database/TopBar.vue';
import ResourcesMenu from '~/components/database/ResourcesMenu.vue';

export default Vue.extend({
  components: {
    TopBar,
    ResourcesMenu,
  },
  head: {
    bodyAttrs: {
      class: 'body-database',
    },
  },
});
</script>
