<template>
  <ul class="list-unstyled">
    <li
      v-for="resource in shownResources"
      :key="resource.name"
      class=""
    >
      <nuxt-link :to="resource.path">
        <t :value="`db.menu.resource.${resource.name}`" class="text-capitalize" />
      </nuxt-link>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import { dbPages, resourcePath } from '~/config/pages';

export default Vue.extend({
  computed: {
    shownResources (): Array<{ name: string, path: string }> {
      return dbPages.map(resource => ({
        name: resource.name,
        path: resourcePath(resource.name, resource.pages[0]),
      }));
    },
  },
});
</script>
